INSERT INTO Users (UserName, Email, PasswordHash)
VALUES
('Demo User', 'demo@aiartgallery.app', '$2a$11$placeholderhashreplacebeforeusing');

INSERT INTO Images (UserId, Title, Tag, Platform, Description, Prompt, BlobUrl)
VALUES
(1, 'Neon Alley Runner', 'cyberpunk', 'Midjourney', 'A cinematic city scene with rain, neon reflections, and a lone runner.', 'Cyberpunk alley at night, neon reflections, rainy street, cinematic lighting, ultra detailed', 'https://example.blob.core.windows.net/ai-images/neon-alley-runner.jpg'),
(1, 'Quiet Mountain Dawn', 'landscape', 'Stable Diffusion', 'A wide cinematic mountain scene with clouds rolling through the valley.', 'Mountain dawn landscape, fog in valley, ultra wide composition, realistic photography', 'https://example.blob.core.windows.net/ai-images/quiet-mountain-dawn.jpg');

INSERT INTO Comments (ImageId, UserId, Content)
VALUES
(1, 1, 'This image works well as a demo seed record.');

INSERT INTO Likes (ImageId, UserId)
VALUES
(1, 1);
