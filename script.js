const productsContainer = document.getElementById('products');
const adminForm = document.getElementById('admin-form');
const productNameInput = document.getElementById('product-name');
const productPriceInput = document.getElementById('product-price');
const productImageInput = document.getElementById('product-image');
const productLinkInput = document.getElementById('product-link');
const searchInput = document.getElementById('search');
const searchSuggestions = document.createElement('ul');

// Admin Login Elements
const adminPasswordSection = document.getElementById('admin-password-section');
const adminPasswordInput = document.getElementById('admin-password');
const adminPasswordSubmit = document.getElementById('admin-password-submit');
const errorMessage = document.getElementById('error-message');
const adminSection = document.getElementById('admin-section');
const adminLoginButton = document.getElementById('admin-login-button');

// Append AI suggestions below search input
searchSuggestions.setAttribute('id', 'search-suggestions');
searchInput.parentNode.appendChild(searchSuggestions);

// Product storage
let products = [];

// Admin password
const correctPassword = 'Vishwas07';

// Load Products
function loadProducts(filteredProducts = products) {
    productsContainer.innerHTML = '';  
    filteredProducts.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p>${product.price}</p>
            <a href="${product.link}" target="_blank" class="buy-now-btn">Buy Now</a>
        `;
        productsContainer.appendChild(productDiv);
    });
}

// **AI Search Suggestions**
function showSearchSuggestions() {
    const query = searchInput.value.trim().toLowerCase();
    searchSuggestions.innerHTML = '';

    if (query === '') {
        searchSuggestions.style.display = 'none';
        return;
    }

    // AI-powered matching with fuzzy logic
    const matchingProducts = products
        .map(product => ({
            product,
            score: getMatchingScore(query, product.name.toLowerCase())
        }))
        .filter(item => item.score > 0)  
        .sort((a, b) => b.score - a.score)  
        .map(item => item.product);

    if (matchingProducts.length === 0) {
        searchSuggestions.style.display = 'none';
        return;
    }

    matchingProducts.forEach(product => {
        const suggestionItem = document.createElement('li');
        suggestionItem.textContent = product.name;
        suggestionItem.addEventListener('click', () => {
            searchInput.value = product.name;
            loadProducts([product]);
            searchSuggestions.style.display = 'none';
        });
        searchSuggestions.appendChild(suggestionItem);
    });

    searchSuggestions.style.display = 'block';
}

// **Fuzzy Matching Algorithm**
function getMatchingScore(query, productName) {
    let score = 0;
    const words = productName.split(' ');

    words.forEach(word => {
        if (word.startsWith(query)) score += 3;  
        else if (word.includes(query)) score += 1;  
    });

    return score;
}

// Hide suggestions on outside click
document.addEventListener('click', (event) => {
    if (!searchInput.contains(event.target) && !searchSuggestions.contains(event.target)) {
        searchSuggestions.style.display = 'none';
    }
});

// Event listener for search input
searchInput.addEventListener('input', showSearchSuggestions);

// Admin: Add New Product
adminForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const newProduct = {
        name: productNameInput.value,
        price: `₹${parseFloat(productPriceInput.value).toFixed(2)}`,
        image: productImageInput.value,
        link: productLinkInput.value
    };

    products.push(newProduct);
    productNameInput.value = '';
    productPriceInput.value = '';
    productImageInput.value = '';
    productLinkInput.value = '';
    loadProducts();
});

// Admin Login
adminLoginButton.addEventListener("click", () => {
    adminPasswordSection.style.display = "block";
});

adminPasswordSubmit.addEventListener("click", () => {
    if (adminPasswordInput.value === correctPassword) {
        adminPasswordSection.style.display = "none";
        adminSection.style.display = "block";
    } else {
        errorMessage.textContent = "Incorrect Password!";
    }
});