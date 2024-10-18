# Syncfusion TypeScript TreeGrid AI Sample

## Sample Description

This demo showcases the use of AI to structure and correct erroneous hierarchical data within a Tree Grid. The AI-powered prompt identifies and organizes data items into a hierarchical format by accurately establishing parent-child relationships. This process ensures that the data is properly nested and ready for display in the Tree Grid control.

![Tree Grid AI Adaptive Structuring](../gif-images/treegrid/adaptive-datastructuring.gif)

## Action Description

The system uses a specialized AI prompt to scan a dataset and identify hierarchical relationships between records. The AI corrects any misassigned relationships by adjusting the `ParentId` fields to align with their respective top-level `CategoryId`. The reorganized dataset is then bound to the Tree Grid for a coherent and accurate display.
