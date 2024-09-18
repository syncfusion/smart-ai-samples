export interface PizzaDataModel {
    Id: string;
    OrderID: string;
    Title: string;
    Type: string;
    Size: string;
    Category: string;
    Description: string;
    CardTags: string[];
    ImageURL: string;
    Price: string;
    Date: Date;
    Feedback?: string;
    SentimentScore?: number;
    Emoji?: string;
}

export let pizzaData: PizzaDataModel[] = [
    {
        Id: "1",
        OrderID: "Order ID - #16365",
        Title: "Mexican Green Wave",
        Type: "Vegetarian",
        Size: "Small",
        Category: "Order",
        Description: "Stromboli sandwich with chili sauce",
        CardTags: ["Onions", "Pepper", "Cheese"],
        ImageURL: "https://blazor.syncfusion.com/demos/_content/Blazor_Server_Common_NET8/images/kanban/menu-01.png",
        Price: "$4.79",
        Date: new Date(new Date().getFullYear(), new Date().getMonth(), 10),
        Feedback: "",
        SentimentScore: 0,
        Emoji: ""
    },
    {
        Id: "2",
        OrderID: "Order ID - #16367",
        Title: "Peppy Paneer",
        Type: "Vegetarian",
        Size: "Large",
        Category: "Ready to Serve",
        Description: "It's made using toppings of tomato, mozzarella cheese and fresh basil",
        CardTags: ["Onions", "Pepper", "Cheese"],
        ImageURL: "https://blazor.syncfusion.com/demos/_content/Blazor_Server_Common_NET8/images/kanban/menu-02.png",
        Price: "$14.99",
        Date: new Date(new Date().getFullYear(), new Date().getMonth(), 10),
        Feedback: "",
        SentimentScore: 0,
        Emoji: ""
    },
    {
        Id: "3",
        OrderID: "Order ID - #16372",
        Title: "Chicken Golden Delight",
        Type: "Non-Vegetarian",
        Size: "Large",
        Category: "Order",
        Description: "Barbeque chicken with a topping of golden corn loaded with extra cheese",
        CardTags: ["BBQ", "Prawn"],
        ImageURL: "https://blazor.syncfusion.com/demos/_content/Blazor_Server_Common_NET8/images/kanban/menu-07.png",
        Price: "$14.99",
        Date: new Date(new Date().getFullYear(), new Date().getMonth(), 10),
        Feedback: "",
        SentimentScore: 0,
        Emoji: ""
    },
    {
        Id: "4",
        OrderID: "Order ID - #16374",
        Title: "Chicken Fiesta",
        Type: "Non-Vegetarian",
        Size: "Small",
        Category: "Delivered",
        Feedback: "Good",
        Description: "Grilled Chicken Rashers with Peri-Peri chicken, Onion and Capsicum",
        CardTags: ["Chicken", "Capsicum"],
        ImageURL: "https://blazor.syncfusion.com/demos/_content/Blazor_Server_Common_NET8/images/kanban/menu-13.png",
        Price: "$4.79",
        Date: new Date(new Date().getFullYear(), new Date().getMonth(), 10),
        SentimentScore: 0,
        Emoji: ""
    },
    {
        Id: "5",
        OrderID: "Order ID - #16375",
        Title: "Double Cheese Margherita",
        Type: "Vegetarian",
        Size: "Medium",
        Category: "Delivered",
        Feedback: "Best",
        Description: "Margherita with chili sauce and double Cheese",
        CardTags: ["Onions", "Pepper"],
        ImageURL: "https://blazor.syncfusion.com/demos/_content/Blazor_Server_Common_NET8/images/kanban/menu-10.png",
        Price: "$11.99",
        Date: new Date(new Date().getFullYear(), new Date().getMonth(), 10),
        SentimentScore: 0,
        Emoji: ""
    },
    {
        Id: "6",
        OrderID: "Order ID - #16379",
        Title: "Chicken Dominator",
        Type: "Non-Vegetarian",
        Size: "Small",
        Category: "Menu",
        Description: "Double Pepper Barbecue Chicken with Peri-Peri Chicken, Chicken Tikka, Grilled and Rashers",
        CardTags: ["Pepper", "Chicken"],
        ImageURL: "https://blazor.syncfusion.com/demos/_content/Blazor_Server_Common_NET8/images/kanban/menu-15.png",
        Price: "$4.79",
        Date: new Date(new Date().getFullYear(), new Date().getMonth(), 10),
        Feedback: "",
        SentimentScore: 0,
        Emoji: ""
    },
    {
        Id: "9",
        OrderID: "Order ID - #16383",
        Title: "Margherita",
        Type: "Vegetarian",
        Size: "Large",
        Category: "Ready to Deliver",
        Description: "Lebanese Pizza topped with tomato sauce",
        CardTags: ["Pepper", "Cheese"],
        ImageURL: "https://blazor.syncfusion.com/demos/_content/Blazor_Server_Common_NET8/images/kanban/menu-18.png",
        Price: "$4.99",
        Date: new Date(new Date().getFullYear(), new Date().getMonth(), 10),
        Feedback: "",
        SentimentScore: 0,
        Emoji: ""
    },
    {
        Id: "10",
        OrderID: "Order ID - #16384",
        Title: "Pepper Barbecue and Onion",
        Type: "Non-Vegetarian",
        Size: "Medium",
        Category: "Ready to Deliver",
        Description: "Pepper Barbecue chicken with Onion",
        CardTags: ["Onions", "Chicken"],
        ImageURL: "https://blazor.syncfusion.com/demos/_content/Blazor_Server_Common_NET8/images/kanban/menu-20.png",
        Price: "$11.99",
        Date: new Date(new Date().getFullYear(), new Date().getMonth(), 10),
        Feedback: "",
        SentimentScore: 0,
        Emoji: ""
    }
];