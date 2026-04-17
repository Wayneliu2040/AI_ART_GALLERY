const mockImages = [
  {
    id: 1,
    title: 'Neon Alley Runner',
    tag: 'cyberpunk',
    description: 'A cinematic city scene with rain, neon reflections, and a lone runner.',
    platform: 'Midjourney',
    likes: 24,
    prompt: 'Cyberpunk alley at night, neon reflections, rainy street, cinematic lighting, ultra detailed',
    imageUrl: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 2,
    title: 'Floating Temple Lake',
    tag: 'fantasy',
    description: 'A surreal temple floating above a calm lake during sunrise.',
    platform: 'DALL·E',
    likes: 18,
    prompt: 'Fantasy floating temple above a mirror lake, sunrise mist, elegant architecture, soft golden light',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 3,
    title: 'Quiet Mountain Dawn',
    tag: 'landscape',
    description: 'A wide cinematic mountain scene with clouds rolling through the valley.',
    platform: 'Stable Diffusion',
    likes: 31,
    prompt: 'Mountain dawn landscape, fog in valley, ultra wide composition, realistic photography',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 4,
    title: 'Studio Portrait Glow',
    tag: 'portrait',
    description: 'A polished portrait with dramatic lighting and shallow depth of field.',
    platform: 'Leonardo AI',
    likes: 15,
    prompt: 'Studio portrait, dramatic edge lighting, high detail skin texture, premium photography look',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80'
  }
];

const galleryGrid = document.getElementById('galleryGrid');
const template = document.getElementById('cardTemplate');
const chips = document.querySelectorAll('.chip');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const logoutBtn = document.getElementById('logoutBtn');

const currentUser = localStorage.getItem('ai_art_gallery_user');
if (!currentUser) {
  window.location.href = 'login.html';
}

let activeTag = 'all';
let keyword = '';

renderCards();

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    chips.forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    activeTag = chip.dataset.tag;
    renderCards();
  });
});

searchBtn.addEventListener('click', () => {
  keyword = searchInput.value.trim().toLowerCase();
  renderCards();
});

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    keyword = searchInput.value.trim().toLowerCase();
    renderCards();
  }
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('ai_art_gallery_user');
  window.location.href = 'login.html';
});

function renderCards() {
  galleryGrid.innerHTML = '';

  const filtered = mockImages.filter((item) => {
    const matchesTag = activeTag === 'all' || item.tag === activeTag;
    const searchable = `${item.title} ${item.tag} ${item.prompt} ${item.description}`.toLowerCase();
    const matchesKeyword = !keyword || searchable.includes(keyword);
    return matchesTag && matchesKeyword;
  });

  if (!filtered.length) {
    galleryGrid.innerHTML = '<p>No images found. Try another keyword or tag.</p>';
    return;
  }

  filtered.forEach((item) => {
    const clone = template.content.cloneNode(true);

    clone.querySelector('.card-image').src = item.imageUrl;
    clone.querySelector('.card-image').alt = item.title;
    clone.querySelector('.card-title').textContent = item.title;
    clone.querySelector('.tag-pill').textContent = item.tag;
    clone.querySelector('.card-description').textContent = item.description;
    clone.querySelector('.platform-value').textContent = item.platform;
    clone.querySelector('.likes-value').textContent = item.likes;
    clone.querySelector('.prompt-value').textContent = item.prompt;

    const likeBtn = clone.querySelector('.like-btn');
    likeBtn.addEventListener('click', () => {
      item.likes += 1;
      renderCards();
    });

    const commentBtn = clone.querySelector('.comment-btn');
    commentBtn.addEventListener('click', () => {
      alert(`This button can be connected to POST /api/images/${item.id}/comments`);
    });

    const detailsBtn = clone.querySelector('.details-btn');
    detailsBtn.addEventListener('click', () => {
      alert(`This button can be connected to GET /api/images/${item.id}`);
    });

    galleryGrid.appendChild(clone);
  });
}
