import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RuleEngine from './components/RuleEngine';

const AppLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl font-bold">Rule Engine</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <Routes>
                        <Route path="/" element={<RuleEngine />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default AppLayout;