﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.JSInterop;

namespace SyncfusionAISamples.Service
{
    public class UserTokenService
    {
        private readonly IJSRuntime _jsRuntime;
        private const string TokenFilePath = "user_tokens.json";
        private static readonly TimeZoneInfo IndianStandardTime = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");

        public UserTokenService(IJSRuntime jsRuntime)
        {
            _jsRuntime = jsRuntime;
        }

        public async Task<string> GetUserFingerprintAsync()
        {
            return await _jsRuntime.InvokeAsync<string>("fingerPrint");
        }

        public async Task<int> GetRemainingTokensAsync(string userCode)
        {
            var tokens = await CheckAndResetTokensAsync(userCode);
            return tokens.ContainsKey(userCode) ? tokens[userCode].RemainingTokens : 10000;
        }

        public async Task UpdateTokensAsync(string userCode, int tokens)
        {
            var tokenData = await ReadTokensFromFileAsync();
            if (tokenData.ContainsKey(userCode))
            {
                tokenData[userCode].RemainingTokens = tokens;
            }
            else
            {
                tokenData[userCode] = new UserTokenInfo
                {
                    UserId = userCode,
                    DateOfLogin = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, IndianStandardTime),
                    RemainingTokens = tokens
                };
            }
            await WriteTokensToFileAsync(tokenData);
        }

        public async Task<Dictionary<string, UserTokenInfo>> CheckAndResetTokensAsync(string userCode)
        {
            var tokenData = await ReadTokensFromFileAsync();
            if (tokenData.ContainsKey(userCode))
            {
                var userTokenInfo = tokenData[userCode];
                var currentTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, IndianStandardTime);
                var timeDifference = currentTime - userTokenInfo.DateOfLogin;

                if (timeDifference.TotalHours > 1)
                {
                    userTokenInfo.RemainingTokens = 10000; // Reset tokens
                    userTokenInfo.DateOfLogin = currentTime; // Update login time
                    await WriteTokensToFileAsync(tokenData);
                }
            }
            return tokenData;
        }

        private async Task<Dictionary<string, UserTokenInfo>> ReadTokensFromFileAsync()
        {
            if (!File.Exists(TokenFilePath))
            {
                var initialData = new Dictionary<string, UserTokenInfo>();
                await WriteTokensToFileAsync(initialData);
                return initialData;
            }

            var json = await File.ReadAllTextAsync(TokenFilePath);
            return JsonSerializer.Deserialize<Dictionary<string, UserTokenInfo>>(json) ?? new Dictionary<string, UserTokenInfo>();
        }

        private async Task WriteTokensToFileAsync(Dictionary<string, UserTokenInfo> tokenData)
        {
            var json = JsonSerializer.Serialize(tokenData, new JsonSerializerOptions { WriteIndented = true });
            await File.WriteAllTextAsync(TokenFilePath, json);
        }

        public async Task ShowAlert()
        {
            await _jsRuntime.InvokeVoidAsync("showAlert", "You have no remaining tokens.");
        }
    }

    public class UserTokenInfo
    {
        public string UserId { get; set; }
        public DateTime DateOfLogin { get; set; }
        public int RemainingTokens { get; set; }
    }
}
