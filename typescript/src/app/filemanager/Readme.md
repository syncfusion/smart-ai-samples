# Syncfusion TypeScript File Manager AI Samples

This README provides an overview of the AI-driven features integrated into the Syncfusion TypeScript File Manager. These features enhance file management by offering smarter search capabilities, automatic content summarization, intelligent organization, AI tagging, and tag-based search.

## 1. Smart File Manager

### Sample Description

This demo showcases the advanced capabilities of the Syncfusion TypeScript File Manager, including:

- **Smart Search**: Users can search for items based on semantic meaning, allowing them to find relevant files even if the search term does not exactly match the file name. To perform a smart search, provide semantic content in the File Manager search bar and click the search icon or press Enter.
- **Content Summary**: Users can quickly get summaries of .txt, .pdf, and .docx files by selecting a file and clicking the "Quick Summary" button in the File Manager Toolbar.
- **Intelligent Organization**: Users can organize files into categories using AI by selecting a folder and clicking the "Organize" button in the File Manager context menu.

These features enhance file management by making search more intuitive, document overview faster, and organization smarter.

![File Manager AI Features](../gif-images/filemanager/smart-filemanager.gif)

### Action Description

- **Smart Search**: This feature uses local embeddings to match search terms with relevant files. The search term is compared with stored data to show only relevant items based on semantic similarity, improving the accuracy and relevance of search results.
- **Content Summary**: This feature extracts and summarizes file content using AI. Users can access it via the "Quick Summary" button, which generates a concise overview of the file's content, making it easier to understand documents without opening them fully.
- **Intelligent Organization**: This feature categorizes and sorts files within selected folders based on AI analysis of file names and metadata. It organizes the files into logical groups, making it easier to manage and locate documents efficiently.
