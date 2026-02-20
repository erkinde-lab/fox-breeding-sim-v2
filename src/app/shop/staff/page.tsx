'use client';

import React from 'react';
import { useGameStore } from '@/lib/store';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Check, Diamond, Activity, Trophy, Microscope, Utensils } from 'lucide-react';

export default function StaffPage() {
  const {
    hiredGroomer, hireGroomer,
    hiredVeterinarian, hireVeterinarian,
    hiredTrainer, hireTrainer,
    hiredGeneticist, hireGeneticist,
    hiredNutritionist, hireNutritionist,
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
    },
    {
      id: 'geneticist',
      name: 'Kennel Geneticist',
      description: 'Unlock the secrets of your foxes. Automatically reveals genotypes for all owned foxes and unlocks detailed Breeding Insights.',
      cost: 100,
      hired: hiredGeneticist,
      onHire: hireGeneticist,
      icon: <Microscope size={48} />,
      color: 'indigo',
      bonus: 'Unlock Genotypes'
    },
    {
      id: 'nutritionist',
      name: 'Professional Nutritionist',
      description: 'Optimize your foxes diet. Allows setting preferred feeds for each fox and enables the "Feed All" button on your dashboard.',
      cost: 75,
      hired: hiredNutritionist,
      onHire: hireNutritionist,
      icon: <Utensils size={48} />,
      color: 'orange',
      bonus: 'Feed All Button'
    }
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-folksy text-foreground tracking-tight" style={{ fontWeight: 400 }}>Staff & Services</h1>
        <p className="text-muted-foreground mt-2">Hire professionals to improve your kennel and fox quality.</p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-folksy text-foreground" style={{ fontWeight: 400 }}>Available Staff</h2>
        <div className="grid grid-cols-1 gap-6">
          {staff.map((member) => (
            <Card key={member.id} className={`border-border bg-card shadow-sm`}>
              <CardHeader className="flex flex-col md:flex-row items-center gap-6 p-8">
                <div className={`p-6 bg-muted rounded-2xl text-primary`}>
                  {member.icon}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <CardTitle className="text-2xl font-black tracking-tight text-foreground">{member.name}</CardTitle>
                  <p className="text-muted-foreground mt-2 text-lg font-medium leading-relaxed">
                    {member.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge variant="outline" className={`bg-muted border-border text-foreground font-bold`}>Permanent Effect</Badge>
                    <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary font-bold">{member.bonus}</Badge>
                  </div>
                </div>
                <div className="w-full md:w-auto">
                  {member.hired ? (
                    <div className="bg-green-100 text-green-700 font-black px-8 py-4 rounded-xl border-2 border-green-200 flex items-center justify-center gap-2">
                      <Check size={20} /> Currently Hired
                    </div>
                  ) : (
                    <Button
                      onClick={member.onHire}
                      disabled={gems < member.cost}
                      className={`bg-primary hover:bg-primary/90 text-primary-foreground w-full md:w-auto h-16 px-10 text-xl font-black shadow-lg shadow-primary/10 border-none transition-all active:scale-95`}
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

      <section className="bg-card border border-border rounded-[40px] p-12 text-foreground relative overflow-hidden shadow-xl">
        <h3 className="text-2xl font-black mb-4">Upcoming Experts</h3>
        <p className="text-muted-foreground text-lg max-w-xl">We are looking for more professionals to join the simulation, including Marketing Experts, Kennel Builders, and Show Judges.</p>
        <div className="absolute top-0 right-0 p-12 opacity-5 text-primary">
          <UserPlus size={200} />
        </div>
      </section>
    </div>
  );
}
