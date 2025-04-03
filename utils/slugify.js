// utils/slugify.js
const slugify = require('slugify');
const Product = require('../schemas/product');
const Category = require('../schemas/category');

// Utility function to generate slug from name
const generateSlug = (name) => {
  return slugify(name, {
    lower: true,      // Convert to lowercase
    strict: true,     // Remove special characters
    remove: /[*+~.()'"!:@]/g // Additional characters to remove
  });
};

// Middleware to handle slug routes
const slugRoutes = async (req, res, next) => {
  try {
    const { categorySlug, productSlug } = req.params;

    // Case 1: Find a specific category by slug
    if (categorySlug && !productSlug) {
      // Convert the slug to find the matching category
      const category = await Category.findOne({ 
        name: { $regex: new RegExp('^' + categorySlug.replace(/-/g, ' '), 'i') } 
      });

      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      // Find all products in this category
      const products = await Product.find({ 
        category: category._id,
        isDeleted: false
      });

      return res.status(200).json({
        category,
        products
      });
    }

    // Case 2: Find a specific product by category and product slug
    if (categorySlug && productSlug) {
      // Find the category first
      const category = await Category.findOne({ 
        name: { $regex: new RegExp('^' + categorySlug.replace(/-/g, ' '), 'i') } 
      });

      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      // Find the specific product
      const product = await Product.findOne({
        category: category._id,
        name: { $regex: new RegExp('^' + productSlug.replace(/-/g, ' '), 'i') },
        isDeleted: false
      });

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      return res.status(200).json({ product });
    }

    // If no parameters matched, move to the next middleware
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Pre-save middleware for Product schema to auto-generate slug
const addProductSlugMiddleware = function() {
  // This would be added to the product schema
  productSchema.pre('save', function(next) {
    if (!this.slug) {
      this.slug = generateSlug(this.name);
    }
    next();
  });
};

// Pre-save middleware for Category schema to auto-generate slug
const addCategorySlugMiddleware = function() {
  // This would be added to the category schema
  categorySchema.pre('save', function(next) {
    if (!this.slug) {
      this.slug = generateSlug(this.name);
    }
    next();
  });
};

module.exports = {
  generateSlug,
  slugRoutes,
  addProductSlugMiddleware,
  addCategorySlugMiddleware
};