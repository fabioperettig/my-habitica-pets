type PetCategory = 'STANDARD' | 'MAGIC_POTION' | 'QUEST' | 'WACKY' | 'SPECIAL';

interface Card {
    id: number;
    level: number;
    key: string;
    name: string;
    imgPet: string;
    imgPotion: string;
    imgEgg: string;
    category: PetCategory;
    eggKey: string;
    potionKey: string;
}

const CATEGORY_ORDER: PetCategory[] = [
    'STANDARD',
    'MAGIC_POTION',
    'QUEST',
    'WACKY',
    'SPECIAL',
];

const CATEGORY_LABELS: Record<PetCategory, string> = {
    STANDARD: 'Standard',
    MAGIC_POTION: 'Magic Potion',
    QUEST: 'Quest',
    WACKY: 'Wacky',
    SPECIAL: 'Special',
};

const isLocal =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

const apiBaseUrl = isLocal
    ? 'http://localhost:8080'
    : 'https://my-habitica-pets.onrender.com';
const mobileLayoutQuery = window.matchMedia('(max-width: 600px)');

const groupsContainer = document.getElementById('pet-groups');
const statusMessage = document.getElementById('status-message');
const searchInput = document.getElementById('search-input') as HTMLInputElement | null;
const resetButton = document.getElementById('reset-filters') as HTMLButtonElement | null;
const filterInputs = document.querySelectorAll<HTMLInputElement>('.filter-list input[type="checkbox"]');
const totalCount = document.getElementById('total-count');
const visibleCount = document.getElementById('visible-count');
const eggImage = document.getElementById('total-egg') as HTMLImageElement | null;
const pixelizeSwitch = document.getElementById('pixelize-switch') as HTMLInputElement | null;
const siteLogo = document.getElementById('site-logo') as HTMLImageElement | null;
const backToTopButton = document.getElementById('back-to-top') as HTMLButtonElement | null;
const mainHeader = document.querySelector<HTMLElement>('.main-header');
const mainNav = document.getElementById('main-nav');
const menuToggle = document.getElementById('menu-toggle') as HTMLButtonElement | null;

let allCards: Card[] = [];
let searchValue = '';
const selectedCategories = new Set<PetCategory>();
let eggRotationTimer: number | undefined;

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatCardNumber(id: number): string {
    const value = String(id);
    return value.length >= 4 ? value : `${'0000'.slice(value.length)}${value}`;
}

function cardTemplate(card: Card): string {
    const potion = card.imgPotion
        ? `<img src="${escapeHtml(card.imgPotion)}" alt="${escapeHtml(card.potionKey)} hatching potion">`
        : '<span class="no-potion" aria-label="No hatching potion">—</span>';

    return `
        <article class="pet-card" data-pet-key="${escapeHtml(card.key)}">
            <div class="card-meta">
                <span class="potion-image">${potion}</span>
                <span class="card-number">${formatCardNumber(card.id)}</span>
            </div>
            <div class="pet-art">
                <img src="${escapeHtml(card.imgPet)}" alt="${escapeHtml(card.name)}" loading="lazy" decoding="async">
            </div>
            <h3>${escapeHtml(card.name)}</h3>
        </article>
    `;
}

function filteredCards(): Card[] {
    return allCards.filter(card => {
        const matchesSearch = card.name.toLowerCase().includes(searchValue);
        const matchesCategory = mobileLayoutQuery.matches
            || selectedCategories.size === 0
            || selectedCategories.has(card.category);
        return matchesSearch && matchesCategory;
    });
}

function renderCards(): void {
    if (!groupsContainer || !statusMessage) return;

    const cards = filteredCards();

    if (visibleCount) visibleCount.textContent = String(cards.length);
    if (totalCount) totalCount.textContent = String(allCards.length);

    if (cards.length === 0) {
        groupsContainer.innerHTML = '';
        statusMessage.textContent = allCards.length === 0
            ? 'No pets were found in this Habitica account.'
            : 'No pets match the current search and filters.';
        statusMessage.hidden = false;
        return;
    }

    statusMessage.hidden = true;
    groupsContainer.innerHTML = CATEGORY_ORDER.map(category => {
        const categoryCards = cards.filter(card => card.category === category);
        if (categoryCards.length === 0) return '';

        return `
            <section class="pet-group" aria-labelledby="heading-${category.toLowerCase()}">
                <h2 id="heading-${category.toLowerCase()}">
                    ${CATEGORY_LABELS[category]} <span aria-hidden="true">▾</span>
                </h2>
                <div class="album-grid">
                    ${categoryCards.map(cardTemplate).join('')}
                </div>
            </section>
        `;
    }).join('');

    enableCardHover();
}

function enableCardHover(): void {
    if (!window.matchMedia('(hover: hover)').matches) return;

    document.querySelectorAll<HTMLElement>('.pet-card').forEach(card => {
        card.addEventListener('pointermove', event => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const rotateX = (rect.height / 2 - y) / 14;
            const rotateY = (x - rect.width / 2) / 14;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.035, 1.035, 1.035)`;
        });

        const resetTransform = () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        };

        card.addEventListener('pointerleave', resetTransform);
        card.addEventListener('pointercancel', resetTransform);
    });
}

function startEggRotation(urls: string[]): void {
    if (!eggImage) return;
    if (eggRotationTimer !== undefined) window.clearInterval(eggRotationTimer);

    const uniqueUrls = [...new Set(urls.filter(Boolean))];
    if (uniqueUrls.length === 0) {
        eggImage.hidden = true;
        return;
    }

    let currentIndex = 0;
    const showCurrentEgg = () => {
        const currentUrl = uniqueUrls[currentIndex];
        if (!currentUrl) return;
        eggImage.src = currentUrl;
        eggImage.hidden = false;
        currentIndex = (currentIndex + 1) % uniqueUrls.length;
    };

    showCurrentEgg();
    if (uniqueUrls.length > 1) {
        eggRotationTimer = window.setInterval(showCurrentEgg, 3000);
    }
}

function updateLogo(pixelized: boolean): void {
    if (!siteLogo || !pixelizeSwitch) return;
    pixelizeSwitch.checked = pixelized;
    document.body.classList.toggle('pixelized', pixelized);
    siteLogo.src = pixelized
        ? 'assets/branding/logo-true.svg'
        : 'assets/branding/logo-false.svg';

    try {
        window.localStorage.setItem('my-habitica-pets-pixelized', String(pixelized));
    } catch {
        // The logo still changes when local storage is unavailable.
    }
}

function setMenuOpen(open: boolean): void {
    const shouldOpen = open && mobileLayoutQuery.matches;
    mainHeader?.classList.toggle('menu-open', shouldOpen);
    document.body.classList.toggle('menu-open', shouldOpen);
    menuToggle?.setAttribute('aria-expanded', String(shouldOpen));
    menuToggle?.setAttribute(
        'aria-label',
        shouldOpen ? 'Close navigation menu' : 'Open navigation menu',
    );
    mainNav?.toggleAttribute('inert', mobileLayoutQuery.matches && !shouldOpen);
}

function updateScrollState(): void {
    const compactHeader = mobileLayoutQuery.matches && window.scrollY > 80;
    mainHeader?.classList.toggle('is-compact', compactHeader);

    const backToTopThreshold = mobileLayoutQuery.matches ? 80 : 400;
    backToTopButton?.classList.toggle('is-visible', window.scrollY > backToTopThreshold);
}

function initializeControls(): void {
    searchInput?.addEventListener('input', event => {
        searchValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        renderCards();
    });

    filterInputs.forEach(input => {
        input.addEventListener('change', () => {
            const category = input.value as PetCategory;
            if (input.checked) selectedCategories.add(category);
            else selectedCategories.delete(category);
            renderCards();
        });
    });

    resetButton?.addEventListener('click', () => {
        selectedCategories.clear();
        filterInputs.forEach(input => { input.checked = false; });
        searchValue = '';
        if (searchInput) searchInput.value = '';
        renderCards();
    });

    let savedPreference = false;
    try {
        savedPreference = window.localStorage.getItem('my-habitica-pets-pixelized') === 'true';
    } catch {
        savedPreference = false;
    }

    updateLogo(savedPreference);
    pixelizeSwitch?.addEventListener('change', () => updateLogo(pixelizeSwitch.checked));

    menuToggle?.addEventListener('click', () => {
        setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
    });

    mainNav?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('keydown', event => {
        if (event.key !== 'Escape' || menuToggle?.getAttribute('aria-expanded') !== 'true') return;
        setMenuOpen(false);
        menuToggle.focus();
    });

    mobileLayoutQuery.addEventListener('change', () => {
        setMenuOpen(false);
        updateScrollState();
        renderCards();
    });

    setMenuOpen(false);
    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();

    backToTopButton?.addEventListener('click', () => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
}

async function getJson<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
    return response.json() as Promise<T>;
}

async function loadCards(): Promise<void> {
    try {
        allCards = await getJson<Card[]>(`${apiBaseUrl}/cards`);
        renderCards();

        const fallbackEggs = allCards.map(card => card.imgEgg).filter(Boolean);
        const eggs = await getJson<string[]>(`${apiBaseUrl}/cards/eggs`).catch(() => fallbackEggs);
        startEggRotation(eggs.length > 0 ? eggs : fallbackEggs);
    } catch (error) {
        console.warn('It was not possible to load the cards from the Java API.', error);
        if (statusMessage) {
            statusMessage.textContent = 'The pets could not be loaded. Please try again later.';
            statusMessage.hidden = false;
        }
    }
}

initializeControls();
void loadCards();
