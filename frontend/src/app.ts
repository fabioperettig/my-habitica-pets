interface Card {
    id: number;
    level: number;
    name: string;
    imgPet: string;
    imgPotion: string;
    logoCard?: string;
    rate: string;
    bgColor: string;
}

function getContrastColor(hexColor: string): string {
    const hex = hexColor.replace('#', '');

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 128 ? '#000000' : '#FFFFFF';
}

function hoverEffect() {
    const cards = document.querySelectorAll('.card') as NodeListOf<HTMLElement>;

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // mouse X position
            const y = e.clientY - rect.top;  // mouse Y position

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Rotation
            const rotateX = (centerY - y) / 10; 
            const rotateY = (x - centerX) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        // mouse-leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}


function exibitionCards(list: Card[]) {
    const container = document.getElementById('album');
    if(!container) return;

    container.innerHTML = list.map(card => {

        const logoURL = card.logoCard || 'assets/logo-card.png';
        const textColor = getContrastColor(card.bgColor);

        const displayLevel = card.level > 0 ? card.level : 0;
        const maxLevelClass = card.level === 5 ? 'max-level' : '';

        return `
             <div class="card ${maxLevelClass}" style="background-color: ${card.bgColor}">
                <div class="card-header">
                    <div class="logo-area">
                        <img src="${logoURL}" class="logo-habitica">
                        <span>Habitica<br>Pets</span>
                    </div>
                    <span class="card-number">${card.id}</span>
                </div>

                <div class="card-title">
                    <h2>${card.name}</h2>
                    <div class="potion-circle">
                        <img src="${card.imgPotion}">
                    </div>
                </div>

                <div class="main-art-frame">
                    <img src="${card.imgPet}" class="pet-img">
                </div>

                <div class="food-bar-container">
                    <div class="food-bar-fill" style="width: ${Math.min(displayLevel * 20, 100)}%"></div>
                </div>

            </div>
        `;
    }).join('');

    hoverEffect();
}

let AllCards: Card[] = [];

async function loadCards() {
    try{
        const response = await fetch('https://my-habitica-pets.onrender.com');
        AllCards = await response.json()
        exibitionCards(AllCards)
    } catch (error) {
        console.warn("Missing cards.json file or Java API...", error);
    }

}

///search
document.getElementById('search-input')?.addEventListener('input', (e) => {
    const searchValue = (e.target as HTMLInputElement).value.toLowerCase();
    
    ///filter
    const filteredCards = AllCards.filter(card =>
        card.name.toLowerCase().includes(searchValue));
    
    exibitionCards(filteredCards);

});


loadCards();
