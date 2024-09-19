# Syncfusion Blazor SmartTextArea Component

`SfSmartTextArea` is an AI-powered enhancement to the traditional textarea, offering sentence-level autocompletion based on its configuration and user input, improving typing speed and efficiency.

![Gif image of SmartTextArea component](../../../wwwroot/gif-images/smart-textarea/smart-textarea.gif)

## Example Use Cases

1. **GitHub Issue Responses**

   In an open-source project, maintainers often respond to a variety of issues raised by users. Using `SfSmartTextArea`, maintainers can quickly draft responses with predefined phrases. For instance, when a maintainer types "To investigate, ", the system might suggest completions like "we'll need a repro as a public Git repo." This reduces response time and ensures consistent, professional communication across issues.

2. **Employee Communicating with Internal Team**

   In internal team communication, `SfSmartTextArea` can assist employees by providing predefined phrases for common tasks. For instance, when an employee types "Let's collaborate ", the system might suggest completions like "on this project to ensure timely delivery." This ensures that team communication remains clear and efficient, reducing the effort required for repetitive messages.

## Adding Syncfusion SmartTextArea in Blazor

### Prerequisites

1. **Install the Syncfusion SmartComponents Package**

   Ensure that the `Syncfusion.Blazor.SmartComponents` NuGet package is installed in your Blazor project.

2. **Configure AI Services**

   To configure AI services, open your `Program.cs` file and add the following code. Replace the placeholders with your actual API credentials.

   ```csharp
   builder.Services.AddSyncfusionSmartComponents() // Inject SmartComponents
       .ConfigureCredentials(new AIServiceCredentials("your-apiKey", "your-deploymentName", "your-endpoint")) 
       .InjectOpenAIInference();
   ```

   This configures the `SfSmartTextArea` with AI-powered autocompletion capabilities.

### Adding the SmartTextArea Component

In your `.razor` file, include the `SfSmartTextArea` component as shown below:

```razor
@page "/"
@using Syncfusion.Blazor.SmartComponents

<SfSmartTextArea @bind-Value="@text" UserRole="Generic professional"></SfSmartTextArea>

@code {
    string? text; // You can set an initial value if needed
}
```

The `UserRole` attribute is mandatory which defines the context for autocompletion suggestions. Using this, you can further customize the suggestions based on your application's needs.

## Customizing the Syncfusion SmartTextArea

The `SfSmartTextArea` inherits all functionalities and properties from the `Syncfusion TextArea` component. This means you can use all the properties and customization options available for the TextArea in the `SfSmartTextArea` as well.

For more information and a detailed guide on using these properties, refer to the official [TextArea Documentation](https://blazor.syncfusion.com/documentation/textarea/getting-started).

## Customizing the Suggestions

By default, the `SfSmartTextArea` provides autocompletion suggestions based on:

- The text around the cursor
- The value of the `UserRole` property
- The value of the `UserPhrases` property

### Setting a User Role

The `UserRole` should be a `string` that describes the role of the person typing and the context of their message. Some example roles include:

- `"Customer service agent responding to client inquiries"`
- `"Project manager drafting a status update for the team"`
- `"Sales representative replying to a potential client's product query"`

### Defining User Phrases

The `UserPhrases` should be a `string[]` (array) containing predefined phrases or expressions that align with your desired tone, style, or common responses. This can include frequently used phrases, important URLs, or relevant policies. For example:

- `"Thank you for your interest."`
- `"Please let me know if you have any further questions."`
- `"You can find more details in our user guide at [URL]."`

This setup enables more personalized and contextually relevant autocompletion suggestions, tailored to the specific needs of your users.

## Reducing Invented Information

Avoid configuring user phrases with specific details that might be reused inappropriately. For instance, instead of using a phrase like `"Bug report: File not found error occurred in version 2.3"`, which could lead to the system suggesting `"version 2.3"` for all file-related completions, use a placeholder like `NEED_INFO`. For example, `"Bug report: File not found error occurred in NEED_INFO"`. This way, the completion suggestion would be `"Bug report: File not found error occurred in "`, allowing the user to fill in the specific information.

Language models can be unpredictable, so you may need to experiment to find the most effective phrases. Even with `NEED_INFO`, the system might occasionally include unintended details.

### Example

```razor
<SfSmartTextArea @bind-Value="@text" UserRole="@userRole" UserPhrases="@userPhrases" />

@code {
    string? text;

    string userRole = "Maintainer of an open-source project replying to GitHub issues";
    string[] userPhrases = [
        "Thank you for contacting us.",
        "To investigate, we'll need a repro as a public Git repo.",
        "Could you please post a screenshot of NEED_INFO?",
        "This sounds like a usage question. This issue tracker is intended for bugs and feature proposals. Unfortunately, we don't have the capacity to answer general usage questions and would recommend StackOverflow for a faster response.",
        "We don't accept ZIP files as repros.",
        "Bug report: File not found error occurred in NEED_INFO"
    ];
}
```

## Controlling the Suggestion UX

Suggestions in the `SfSmartTextArea` are shown differently based on the type of device:

- **On non-touch devices (desktop)**: Suggestion appears inline within the textarea, displayed in grey text ahead of the cursor. Users can accept suggestions by pressing the "Tab" key.
- **On touch devices (mobile)**: Suggestion appears in a floating overlay below the cursor. Users can tap on the suggestion in the overlay to accept it. On mobile devices with keyboards, the "Tab" key can also be used, but most mobile devices lack this key.

To customize the default suggestion display behavior based on user preference, use the ShowSuggestionOnPopup property.

```razor
<SfSmartTextArea ShowSuggestionOnPopup="true" ... />
```

### Property Values

<table>
  <thead>
    <tr>
      <th>Property Value</th>
      <th>Behavior</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>true</td>
      <td>Suggestions are always displayed as a floating overlay, which can be tapped or clicked.</td>
    </tr>
    <tr>
      <td>false</td>
      <td>Suggestions are always shown inline within the textarea, and can be accepted by pressing "Tab".</td>
    </tr>
    <tr>
      <td>Not Set</td>
      <td>By default, touch devices display suggestions in a floating overlay whereas non-touch devices display them inline.</td>
    </tr>
  </tbody>
</table>

#### When `ShowSuggestionOnPopup` is true

![Gif image of ShowSuggestionOnPopup is true](../../../wwwroot/gif-images/smart-textarea/suggestion-onpopup.gif)

#### When `ShowSuggestionOnPopup` is false

![Gif image of ShowSuggestionOnPopup is false](../../../wwwroot/gif-images/smart-textarea/suggestion-inline.gif)
