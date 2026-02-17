'use client';

import React from 'react';
import { useGameStore } from '@/lib/store';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Check, Diamond, Activity, Trophy } from 'lucide-react';

export default function StaffPage() {
  const { 
    hiredGroomer, hireGroomer, 
    hiredVeterinarian, hireVeterinarian,
    hiredTrainer, hireTrainer,
    gems 
  } = useGameStore();

  const staff = [
    {
      id: 'groomer',
      name: 'Professional Groomer',
      description: 'Provide expert care to all your foxes. Grants a permanent +5 Coat Quality bonus to all your foxes in shows.',
      cost: 20,
      hired: hiredGroomer,
      onHire: hireGroomer,
      icon: <UserPlus size={48} />,
      color: 'purple',
      bonus: '+5 Coat Quality'
    },
    {
      id: 'trainer',
      name: 'Expert Trainer',
      description: 'Polish your foxes behavior and presence. Grants a permanent +3 Temperament and +3 Presence bonus in shows.',
      cost: 40,
      hired: hiredTrainer,
      onHire: hireTrainer,
      icon: <Trophy size={48} />,
      color: 'blue',
      bonus: '+3 Temp / +3 Pres'
    },
    {
      id: 'veterinarian',
      name: 'Kennel Veterinarian',
      description: 'Ensure the structural integrity and health of your stock. Grants a permanent +1 bonus to all physical traits (Head, Topline, etc).',
      cost: 50,
      hired: hiredVeterinarian,
      onHire: hireVeterinarian,
      icon: <Activity size={48} />,
      color: 'red',
      bonus: '+1 Physical Traits'
    }
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Staff & Services</h1>
        <p className="text-slate-500 mt-2">Hire professionals to improve your kennel and fox quality.</p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Available Staff</h2>
        <div className="grid grid-cols-1 gap-6">
            {staff.map((member) => (
                <Card key={member.id} className={`border-${member.color}-200`}>
                    <CardHeader className="flex flex-col md:flex-row items-center gap-6 p-8">
                        <div className={`p-6 bg-${member.color}-100 rounded-2xl text-${member.color}-600`}>
                            {member.icon}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <CardTitle className="text-2xl">{member.name}</CardTitle>
                            <p className="text-slate-600 mt-2 text-lg">
                              {member.description}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                              <Badge variant="outline" className={`bg-${member.color}-50 border-${member.color}-200 text-${member.color}-700`}>Permanent Effect</Badge>
                              <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">{member.bonus}</Badge>
                            </div>
                        </div>
                        <div className="w-full md:w-auto">
                            {member.hired ? (
                                <div className="bg-green-100 text-green-700 font-bold px-8 py-4 rounded-xl border-2 border-green-200 flex items-center justify-center gap-2">
                                    <Check size={20} /> Currently Hired
                                </div>
                            ) : (
                                <Button 
                                    onClick={member.onHire}
                                    disabled={gems < member.cost}
                                    className={`bg-${member.color}-600 hover:bg-${member.color}-500 text-white w-full md:w-auto h-16 px-10 text-xl font-bold shadow-lg shadow-${member.color}-200`}
                                >
                                    <Diamond size={24} className="mr-2" /> {member.cost} Gems
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                </Card>
            ))}
        </div>
      </section>
      
      <section className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Coming Soon</h3>
        <p className="text-slate-500">We are looking for more professionals to join the simulation, including Geneticists, Nutritionists, and Marketing Experts.</p>
      </section>
    </div>
  );
}
