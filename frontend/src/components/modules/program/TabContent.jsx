import React from 'react'

import Overview from './Overview';
import Timeline from './Timeline';
import Budget from './Budget';
import Support from './Support';

const TabContent = ({ activeTab }) => {
    switch (activeTab) {
        case 'overview':
            return <Overview />;
        case 'timeline':
            return <Timeline />;
        case 'budget':
            return <Budget />;
        case 'support':
            return <Support />;
        default:
            return <Overview />;
    }
}

export default TabContent