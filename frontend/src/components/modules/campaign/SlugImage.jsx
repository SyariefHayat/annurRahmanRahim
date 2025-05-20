import React from 'react';

export const SlugImage = ({ image, title }) => {
    return (
        <div className="relative overflow-hidden rounded-xl">
            <img 
                src={`${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}${image}`} 
                alt={title} 
                className="w-full h-auto object-cover aspect-video shadow-sm"
            />
        </div>
    );
};