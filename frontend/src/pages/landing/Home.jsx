import React from 'react';

import Navbar from './Navbar';
import HeroSection from './HeroSection';
import FeatureSection from './FeatureSection';
import CampaignSection from './CampaignSection';
import ImpactSection from './ImpactSection';
import ArticleSection from './ArticleSection';
import FaqSection from './FaqSection';
import Footer from './Footer';
import DefaultLayout from '@/components/layouts/DefaultLayout';

const Home = () => {
    return (
        <DefaultLayout>
            <Navbar />
            <HeroSection />
            <FeatureSection />
            <CampaignSection />
            <ImpactSection />
            <ArticleSection />
            <FaqSection />
            <Footer />
        </DefaultLayout>
    );
};

export default Home;