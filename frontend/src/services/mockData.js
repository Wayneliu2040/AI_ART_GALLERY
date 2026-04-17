export const mockImages = [
  {
    id: 1,
    title: 'Neon Alley Runner',
    tag: 'cyberpunk',
    description: 'A cinematic city scene with rain, neon reflections, and a lone runner.',
    platform: 'Midjourney',
    likes: 24,
    commentsCount: 3,
    createdAt: '2026-04-01T10:15:00Z',
    authorName: 'Wayne',
    prompt:
      'Cyberpunk alley at night, neon reflections, rainy street, cinematic lighting, ultra detailed',
    imageUrl:
      'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 2,
    title: 'Floating Temple Lake',
    tag: 'fantasy',
    description: 'A surreal temple floating above a calm lake during sunrise.',
    platform: 'DALL·E',
    likes: 18,
    commentsCount: 2,
    createdAt: '2026-04-04T06:42:00Z',
    authorName: 'Avery',
    prompt:
      'Fantasy floating temple above a mirror lake, sunrise mist, elegant architecture, soft golden light',
    imageUrl:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 3,
    title: 'Quiet Mountain Dawn',
    tag: 'landscape',
    description: 'A wide cinematic mountain scene with clouds rolling through the valley.',
    platform: 'Stable Diffusion',
    likes: 31,
    commentsCount: 5,
    createdAt: '2026-04-07T09:20:00Z',
    authorName: 'Jordan',
    prompt:
      'Mountain dawn landscape, fog in valley, ultra wide composition, realistic photography',
    imageUrl:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 4,
    title: 'Studio Portrait Glow',
    tag: 'portrait',
    description: 'A polished portrait with dramatic lighting and shallow depth of field.',
    platform: 'Leonardo AI',
    likes: 15,
    commentsCount: 1,
    createdAt: '2026-04-09T14:08:00Z',
    authorName: 'Taylor',
    prompt:
      'Studio portrait, dramatic edge lighting, high detail skin texture, premium photography look',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80'
  }
];

export const mockCommentsByImageId = {
  1: [
    {
      id: 101,
      authorName: 'Avery',
      content: 'The reflections and depth here are really strong.',
      createdAt: '2026-04-02T08:15:00Z'
    },
    {
      id: 102,
      authorName: 'Taylor',
      content: 'This would look great as a homepage hero image.',
      createdAt: '2026-04-02T10:10:00Z'
    }
  ],
  2: [
    {
      id: 201,
      authorName: 'Jordan',
      content: 'The lighting feels very calm and polished.',
      createdAt: '2026-04-05T06:15:00Z'
    }
  ],
  3: [
    {
      id: 301,
      authorName: 'Wayne',
      content: 'This is a good example image for the landscape filter.',
      createdAt: '2026-04-08T11:35:00Z'
    }
  ],
  4: []
};
