import React from 'react';

import SlugImage from './SlugImage';
import SlugHeader from './SlugHeader';
import TabsProgram from './TabsProgram';
import Footer from '@/pages/landing/Footer';

const SlugDetail = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <SlugImage />
                        
                        <div className="lg:col-span-2">
                            <SlugHeader />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto lg:px-8 py-8">
                <div className="grid grid-cols-1 gap-8">
                    <div className="lg:col-span-2">
                        <TabsProgram />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default SlugDetail;