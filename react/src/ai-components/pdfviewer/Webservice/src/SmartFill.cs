using System.Threading.Tasks;

namespace EJ2APIServices_NET8
{
    public class SmartFill
    {
        private SematicKernalAI? sematicKernalAI;
        public void InitializeOpenAI(string key)
        {
            sematicKernalAI = new SematicKernalAI(key);
        }
        public async Task<string> GetSmartFillContent(string prompt)
        {
            return await sematicKernalAI.GetSmartFillFromGPT(prompt);
        }
    }
}
