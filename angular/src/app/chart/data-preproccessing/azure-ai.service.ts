import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AzureAIService {
  private endpoint = 'YOUR_AZURE_OPENAI_ENDPOINT'; // e.g. https://<your-resource>.openai.azure.com/
  private apiKey = 'YOUR_API_KEY';
  private deploymentName = 'YOUR_DEPLOYMENT_NAME'; // model deployment name

  constructor(private http: HttpClient) {}

  public async getCompletion(prompt: string): Promise<string> {
    const url = `${this.endpoint}/openai/deployments/${this.deploymentName}/completions?api-version=2023-07-01-preview`;
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'api-key': this.apiKey
    });

    const body = {
      prompt: prompt,
      max_tokens: 500,
      temperature: 0.5
    };

    const response$ = this.http.post<any>(url, body, { headers });
    const response = await lastValueFrom(response$);

    // Azure returns choices array
    return response.choices && response.choices.length > 0 ? response.choices[0].text : '';
  }
}
