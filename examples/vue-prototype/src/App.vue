<template>
  <div class="container">
    <h1>Product Catalog</h1>
    <p class="subtitle">Use the "Add Comment" button in the top bar to leave feedback on this prototype</p>

    <div class="filters">
      <button
        v-for="category in categories"
        :key="category"
        :class="['filter-btn', { active: selectedCategory === category }]"
        @click="selectedCategory = category"
      >
        {{ category }}
      </button>
    </div>

    <div class="product-grid">
      <div v-for="product in filteredProducts" :key="product.id" class="product-card">
        <div class="product-image">{{ product.emoji }}</div>
        <div class="product-info">
          <div class="product-name">{{ product.name }}</div>
          <div class="product-description">{{ product.description }}</div>
          <div class="product-footer">
            <div class="product-price">${{ product.price }}</div>
            <div class="product-category">{{ product.category }}</div>
          </div>
          <button class="add-to-cart" @click="addToCart(product)">Add to Cart</button>
        </div>
      </div>
    </div>

    <div v-if="filteredProducts.length === 0" class="empty-state">
      No products found in this category
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const products = ref([
  {
    id: 1,
    name: 'Wireless Headphones',
    description: 'Premium noise-canceling headphones with 30-hour battery life',
    price: 299,
    category: 'Electronics',
    emoji: '🎧'
  },
  {
    id: 2,
    name: 'Smart Watch',
    description: 'Fitness tracker with heart rate monitor and GPS',
    price: 399,
    category: 'Electronics',
    emoji: '⌚'
  },
  {
    id: 3,
    name: 'Desk Lamp',
    description: 'Modern LED desk lamp with adjustable brightness',
    price: 89,
    category: 'Home',
    emoji: '💡'
  },
  {
    id: 4,
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe',
    price: 129,
    category: 'Home',
    emoji: '☕'
  },
  {
    id: 5,
    name: 'Running Shoes',
    description: 'Lightweight running shoes with cushioned sole',
    price: 159,
    category: 'Sports',
    emoji: '👟'
  },
  {
    id: 6,
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat with carry strap',
    price: 45,
    category: 'Sports',
    emoji: '🧘'
  },
  {
    id: 7,
    name: 'Backpack',
    description: 'Durable laptop backpack with multiple compartments',
    price: 79,
    category: 'Accessories',
    emoji: '🎒'
  },
  {
    id: 8,
    name: 'Sunglasses',
    description: 'Polarized sunglasses with UV protection',
    price: 149,
    category: 'Accessories',
    emoji: '🕶️'
  }
])

const categories = ref(['All', 'Electronics', 'Home', 'Sports', 'Accessories'])
const selectedCategory = ref('All')

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'All') {
    return products.value
  }
  return products.value.filter(p => p.category === selectedCategory.value)
})

const addToCart = (product) => {
  console.log('Added to cart:', product.name)
}
</script>
