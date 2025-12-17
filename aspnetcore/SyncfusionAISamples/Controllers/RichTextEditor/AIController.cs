using Microsoft.AspNetCore.Mvc;
using SyncfusionAISamples.Services;


namespace SyncfusionAISamples.Controllers.RichTextEditor
{
    [ApiController]
    [Route("api/[controller]")]
    public class AIController : ControllerBase
    {
        private readonly AIService _aiService;
        public AIController(AIService aiService)
        {
            _aiService = aiService;
        }

        [HttpPost("Stream")]
        public async Task Stream([FromBody] ChatRequest request)
        {
            await _aiService.StreamAsync(request, HttpContext);
        }
    }
}
