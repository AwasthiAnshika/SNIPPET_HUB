/**
 * Initialize MongoDB Indexes
 * Creates all necessary indexes for collections
 * Handles language field conflicts with text index
 */

require('dotenv').config()
const mongoose = require('mongoose')
const Snippet = require('../src/models/Snippet')
const User = require('../src/models/User')
const Favorite = require('../src/models/Favorite')
const Rating = require('../src/models/Rating')

async function createIndexes() {
  try {
    console.log('🔄 Connecting to MongoDB...')
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/code_snippets'
    )
    console.log('✅ Connected to MongoDB')

    console.log('\n📊 Creating indexes...\n')

    // Snippet indexes
    console.log('📍 Snippet collection:')
    
    // Drop the collection entirely to avoid language field conflicts
    try {
      await Snippet.collection.drop()
      console.log('  ℹ️  Dropped collection to reset (language field conflict)')
    } catch (err) {
      // Collection doesn't exist, that's fine
      if (err.code !== 26) { // 26 = namespace not found
        console.log('  ℹ️  Collection already exists')
      }
    }
    
    try {
      // Create text index WITHOUT language_override to avoid conflicts with 'language' field
      // The text index will use English as default language for all fields
      const snippetIndexes = await Snippet.collection.createIndex(
        { title: 'text', description: 'text', tags: 'text', code: 'text' },
        { weights: { title: 5, description: 2, tags: 3, code: 1 } }
      )
      console.log('  ✅ Text index created')
    } catch (err) {
      if (err.code === 85) {
        console.log('  ℹ️  Text index already exists')
      } else {
        throw err
      }
    }

    try {
      await Snippet.collection.createIndex({ lang: 1 })
      console.log('  ✅ Language index created')
    } catch (err) {
      if (err.code === 85) {
        console.log('  ℹ️  Language index already exists')
      } else {
        throw err
      }
    }

    try {
      await Snippet.collection.createIndex({ tags: 1 })
      console.log('  ✅ Tags index created')
    } catch (err) {
      if (err.code === 85) {
        console.log('  ℹ️  Tags index already exists')
      } else {
        throw err
      }
    }

    // User indexes
    console.log('\n📍 User collection:')
    try {
      await User.collection.createIndex({ email: 1 }, { unique: true })
      console.log('  ✅ Email unique index created')
    } catch (err) {
      if (err.code === 85) {
        console.log('  ℹ️  Email index already exists')
      } else {
        throw err
      }
    }

    // Favorite indexes
    console.log('\n📍 Favorite collection:')
    try {
      await Favorite.collection.createIndex(
        { userId: 1, snippetId: 1 },
        { unique: true }
      )
      console.log('  ✅ User-Snippet unique index created')
    } catch (err) {
      if (err.code === 85) {
        console.log('  ℹ️  User-Snippet index already exists')
      } else {
        throw err
      }
    }

    try {
      await Favorite.collection.createIndex({ userId: 1 })
      console.log('  ✅ UserId index created')
    } catch (err) {
      if (err.code === 85) {
        console.log('  ℹ️  UserId index already exists')
      } else {
        throw err
      }
    }

    // Rating indexes
    console.log('\n📍 Rating collection:')
    try {
      await Rating.collection.createIndex(
        { snippetId: 1, userId: 1 },
        { unique: true }
      )
      console.log('  ✅ SnippetId-UserId unique index created')
    } catch (err) {
      if (err.code === 85) {
        console.log('  ℹ️  SnippetId-UserId index already exists')
      } else {
        throw err
      }
    }

    try {
      await Rating.collection.createIndex({ snippetId: 1 })
      console.log('  ✅ SnippetId index created')
    } catch (err) {
      if (err.code === 85) {
        console.log('  ℹ️  SnippetId index already exists')
      } else {
        throw err
      }
    }

    console.log('\n✅ All indexes created successfully!\n')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error creating indexes:', err.message)
    console.error(err)
    process.exit(1)
  }
}

createIndexes()
