# Extension permissions

The bootstrap requests the minimum permissions needed for the planned manual workflow and SIWC spike.

| Permission                  | Why it exists                                                                                                                                                    |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `activeTab`                 | Temporary access to the current page after a user action.                                                                                                        |
| `scripting`                 | Inject the unlisted page translation script after that user action.                                                                                              |
| `storage`                   | Persist ordinary preferences/registration data and test session-only storage during the SIWC spike. Persistent token storage is not approved by this permission. |
| `declarativeNetRequest`     | Feasibility test for exact loopback OAuth callback interception.                                                                                                 |
| `http://127.0.0.1/*`        | OpenAI's current SIWC loopback callback family; the runtime rule is restricted to one random exact port/path.                                                    |
| `https://auth.openai.com/*` | SIWC authorization flow.                                                                                                                                         |
| `https://api.openai.com/*`  | Model listing and Responses API calls from the privileged extension runtime.                                                                                     |

The project does not request `<all_urls>` in the bootstrap. Any future host permission must be separately justified and reviewed.
