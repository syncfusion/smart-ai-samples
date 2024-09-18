namespace SyncfusionAISamples.Components.Pages.SmartTextArea
{
    public partial class SmartTextArea
    {
        private string? prompt;
        public string DropDownValue = "Role1";
        public string ChangeValue { get; set; } = "Maintainer of an open-source project replying to GitHub issues";
        private Preset? currentPreset;
        private string? apiKey;
        private bool isValid;


        private List<Role> Roles = new List<Role>
    {
        new Role { ID = "Role1", Text = "Maintainer of an open-source project replying to GitHub issues" },
        new Role { ID = "Role2", Text = "Employee communicating with internal team" },
        new Role { ID = "Role3", Text = "Customer support representative responding to customer queries" },
        new Role { ID = "Role4", Text = "Sales representative responding to client inquiries" }
    };

        private Preset[] presets = new Preset[]
        {
        new Preset
        {
            userRole = "Maintainer of an open-source project replying to GitHub issues",
            userPhrases = new string[] {
                "Thank you for contacting us.",
                "To investigate, we'll need a repro as a public Git repo.",
                "Could you please post a screenshot of NEED_INFO?",
                "This sounds like a usage question. This issue tracker is intended for bugs and feature proposals. Unfortunately, we don't have the capacity to answer general usage questions and would recommend StackOverflow for a faster response.",
                "We don't accept ZIP files as repros."
            },
            placeHolder = "Start typing Create an issue..."
        },
        new Preset
        {

                userRole = "Customer support representative responding to customer queries",
                userPhrases = new string[] {
                    "Thank you for reaching out to us.",
                    "Can you please provide your order number?",
                    "We apologize for the inconvenience.",
                    "Our team is looking into this issue and will get back to you shortly.",
                    "For urgent matters, please call our support line."
                },
                placeHolder = "Enter your reply to the customer query..."
        },
        new Preset
        {
            userRole = "Employee communicating with internal team",
            userPhrases = new string[] {
                "Please find the attached report.",
                "Let's schedule a meeting to discuss this further.",
                "Can you provide an update on this task?",
                "I appreciate your prompt response.",
                "Let's collaborate on this project to ensure timely delivery."
            },
            placeHolder = "Draft your message for the team..."
        },
        new Preset
        {
            userRole = "Sales representative responding to client inquiries",
            userPhrases = new string[] {
                "Thank you for your interest in our product.",
                "Can I schedule a demo for you?",
                "Please find the pricing details attached.",
                "Our team is excited to work with you.",
                "Let me know if you have any further questions."
            },
            placeHolder = "Enter your reply to the client's inquiry..."
        }
        };

        protected override void OnInitialized()
        {
            base.OnInitialized();
            currentPreset = presets[0];
        }

        public void OnChange(Syncfusion.Blazor.DropDowns.ChangeEventArgs<string, Role> args)
        {
            this.ChangeValue = args.ItemData.Text;
            currentPreset = presets.Single(p => p.userRole == this.ChangeValue);
        }

        public class Role
        {
            public string? ID { get; set; }
            public string? Text { get; set; }
        }

        class Preset
        {
            public string? userRole { get; set; }
            public string[]? userPhrases { get; set; }
            public string? placeHolder { get; set; }
        }
    }
}
