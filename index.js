const btnContainer = document.getElementById('btn-container');
const cardContainer = document.getElementById('card-container');
const errorElement = document.getElementById('error-element');
const sortBtn = document.getElementById('sort-btn');

let currentContainer = 1000;
let shortView = false;


sortBtn.addEventListener('click', () => {
    shortView = true;
    categoryId(currentContainer, shortView);
})


const loadData = async () => {
    const response = await fetch('https://openapi.programming-hero.com/api/videos/categories')
    const data = await response.json()
    const allCategory = data.data
    // console.log(allCategory)
    allCategory.forEach(category => {
        // console.log(category);
        const button = document.createElement("button");
        button.innerText = category.category
        button.className = `category-btn btn btn-ghost bg-slate-700 text-white text-lg`
        button.addEventListener("click", () => {
            categoryId(category.category_id)
            const categoryBtn = document.querySelectorAll('.category-btn');
            for (const btn of categoryBtn) {
                btn.classList.remove("bg-red-600")
            }
            button.classList.add("bg-red-600")
        })
        btnContainer.appendChild(button)
    });
}



const categoryId = async (id, shortView) => {
    currentContainer = id
    // console.log(id)
    const response = await fetch(`https://openapi.programming-hero.com/api/videos/category/${id}`)
    const data = await response.json()
    const allCard = data.data

    const dateTime = (millisecond) => {
        let second = Math.floor(millisecond / 1000);
        let minute = Math.floor(millisecond / 60);
        second = second % 60;
        minute = minute % 60;
        let hour = Math.floor(millisecond / 60);
        hour = hour % 24;
        return `${hour} hrs ${minute} min ago`;
    }


    if (shortView) {
        allCard.sort((a, b) => {
            const totalViewFirst = a.others.views;
            const totalViewSecond = b.others.views;
            const totalViewFirstNumber = parseFloat(totalViewFirst.replace("k", "")) || 0;
            const totalViewSecondNumber = parseFloat(totalViewSecond.replace("k", "")) || 0;
            return totalViewSecondNumber - totalViewFirstNumber;
        })
    }

    if (allCard.length === 0) {
        errorElement.classList.remove('hidden')
    }
    else {
        errorElement.classList.add('hidden')
    }
    cardContainer.innerHTML = "";
    allCard.forEach(card => {
        // console.log(card)
        let verifyBadge = '';
        if (card.authors[0].verified) {
            verifyBadge = `<img class="w-6 h-6" src="./images/verify.png" alt="">`
        }
        const div = document.createElement('div');
        div.innerHTML = `
        <div class="card w-full bg-base-100 shadow-xl">
                <figure class="overflow-hidden h-72">
                    <img class="w-full" src=${card.thumbnail} alt="Shoes" />
                    <h6 class="absolute bottom-[40%] right-12 text-white">${dateTime(card.others.posted_date)}</h6>
                </figure>
                <div class="card-body">
                    <div class="flex space-x-4 justify-start items-start">
                        <div>
                            <img class="w-12 h-12 rounded-full" src=${card.authors[0].profile_picture} alt="Shoes" />
                        </div>
                        <div>
                            <h2 class="card-title">${card.title}</h2>
                            <div class="flex mt-3">
                                <p class="">${card.authors[0].profile_name}</p>
                                ${verifyBadge}
                            </div>
                            <p class="mt-3">${card.others.views}</p>
                        </div>
                    </div>
                </div>
            </div>
        `
        cardContainer.appendChild(div)
    });




}



categoryId(currentContainer)
loadData()