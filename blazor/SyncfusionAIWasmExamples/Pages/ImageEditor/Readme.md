# Syncfusion Blazor Image Editor - Smart Image Editor

## Prerequisites

Image Editor AI samples rely on third party [Stability AI](https://stability.ai/) service.

### Configuring Image Editor AI
The Image Editor AI depends on a third-party AI service called Stability AI for AI Image processing. To use it, follow these steps:

- You may obtain your API key from [Stability AI](https://platform.stability.ai/account/keys).
- Navigate to `SmartImageEditor.razor` file under `Pages/ImageEditor` folder and replace the placeholder with actual API_KEY:

```cs
// Stability AI APIKEY
public string ApiKey = "your-api-key";

```

Once configured everything, hit `Run` and you're good to go!

## Overview

This demo highlights the advanced features of the **Syncfusion Blazor Image Editor**, including tools designed to enhance image editing capabilities.

## Features

- **Magic Eraser**:
  - Select and remove unwanted elements from an image.
  - Automatically blends the surrounding background for a smooth, natural look.
  - Ideal for cleaning up images and eliminating distractions.

- **Background Changer**:
  - Replace or modify the existing background of an image.
  - Customize the scene while preserving the integrity of the main subject.
  - Offers a creative way to alter the context or setting of an image.

- **Background Remover**:
  - Remove the background from an image to isolate the main subject.
  - Create transparent backgrounds or place the subject onto different backdrops.
  - Enhances the versatility of image editing.

## How It Works

The **Smart Image Editor** offers three advanced tools:

- **Magic Eraser**: Users can erase unwanted elements and automatically blend the background for a clean finish.
- **Background Changer**: Allows users to change the background of an image, keeping the main subject intact for creative customization.
- **Background Remover**: Isolates the main subject by removing the background, useful for creating transparent backgrounds or new contexts.

These features make the Image Editor more intuitive and sophisticated, significantly enhancing the image editing experience.
