interface Card {
    id: number;
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

        return `
            <div class="card" style="background-color: ${card.bgColor}; color: ${textColor};">
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
            </div>
        `;
    }).join('');

    hoverEffect();
}

async function loadCards() {
    try{
        const response = await fetch('cards.json')
        const data: Card[] = await response.json()
        exibitionCards(data)
    } catch (error) {
        console.warn("Missing cards.json file or Java API...");
    }

}

loadCards();
