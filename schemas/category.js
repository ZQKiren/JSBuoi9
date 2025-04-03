// models/category.js
let mongoose = require('mongoose');
const slugify = require('slugify');

let categorySchema = new mongoose.Schema({
    name:{
        type: String,
        unique: true,
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    description:{
        type: String,
        default: ""
    }
},{
    timestamps: true
});

// Pre-save middleware to auto-generate slug from name
categorySchema.pre('save', function(next) {
    if (!this.slug) {
        this.slug = slugify(this.name, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g
        });
    }
    next();
});

module.exports = mongoose.model('category', categorySchema);