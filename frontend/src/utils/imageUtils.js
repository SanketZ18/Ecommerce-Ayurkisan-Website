/**
 * Utility to resolve product and package image URLs.
 * Handles full URLs, filenames, and missing images with appropriate fallbacks.
 */

export const resolveProductImage = (imageName, productId = null) => {
    // 1. Fallback if no image name is provided
    if (!imageName) {
        // If we have an ID like 'ayk-10001', try to guess the filename
        if (productId && typeof productId === 'string' && productId.includes('-')) {
            const numPart = productId.split('-')[1];
            if (numPart && !isNaN(numPart)) {
                return `/assets/Product_Images/${numPart}.png`;
            }
        }
        return 'https://via.placeholder.com/400x400?text=Product+Image';
    }

    // 2. Return as-is if it's already a full URL
    if (imageName.startsWith('http') || imageName.startsWith('blob:') || imageName.startsWith('data:')) {
        return imageName;
    }

    // 3. If it looks like a filename (e.g., "10001.png"), prepend the correct path
    // We expect images to be in public/assets/Product_Images/
    return `/assets/Product_Images/${imageName}`;
};

export const resolvePackageImage = (imageName) => {
    if (!imageName) return 'https://via.placeholder.com/600x400?text=Wellness+Package';
    if (imageName.startsWith('http') || imageName.startsWith('blob:') || imageName.startsWith('data:')) {
        return imageName;
    }
    // Packages might also be in assets/product_images or a separate folder
    // For now, assume they are relative to public
    return imageName.startsWith('/') ? imageName : `/${imageName}`;
};
