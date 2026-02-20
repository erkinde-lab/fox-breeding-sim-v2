'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Book, Zap, Heart, Microscope, Trophy, AlertTriangle, Info } from 'lucide-react';

const SectionHeader = ({ icon: Icon, label }: { icon: React.ElementType; label: string }) => (
  <h2 className="text-2xl font-folksy text-foreground flex items-center gap-2" style={{ fontWeight: 400 }}>
    <Icon className="text-primary" size={24} /> {label}
  </h2>
);

const InfoTile = ({ icon: Icon, color, title, children }: { icon: React.ElementType; color: string; title: string; children: React.ReactNode }) => (
  <div className="flex gap-4">
    <div className={`${color} p-3 rounded-2xl h-fit border`}><Icon size={20} /></div>
    <div>
      <h4 className="font-black text-foreground text-lg italic">{title}</h4>
      <div className="text-muted-foreground leading-relaxed mt-1 text-sm">{children}</div>
    </div>
  </div>
);

const LocusBadge = ({ label, color }: { label: string; color: string }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ${color}`}>{label}</span>
);

const loci = [
  {
    key: 'A',
    name: 'Agouti (A)',
    alleles: 'A (dominant) / a (recessive)',
    effect: 'Controls the base color distribution across the coat. A_ results in warmer base colors (Red, Gold). aa produces darker, less pigmented silver tones (Alaskan Silver). Combined with B, it determines which of the nine base color classes a fox falls into.',
    health: null,
  },
  {
    key: 'B',
    name: 'Black (B)',
    alleles: 'B (dominant) / b (recessive)',
    effect: 'Modifies intensity of the black pigment in the base color. BB results in deep black/red coats (Red or Alaskan Silver). bb dilutes black pigment, shifting toward standard silver tones. Works together with Agouti to build the base color grid.',
    health: null,
  },
  {
    key: 'C',
    name: 'Albino (C)',
    alleles: 'C (dominant) / c (recessive)',
    effect: 'cc (homozygous recessive) blocks all melanin production, resulting in a white coat and red eyes. One copy (Cc) has no visible effect — the fox is a hidden carrier. Albinism masks all other color genetics.',
    health: 'Albino foxes (cc) may have photosensitivity and reduced vision in strong light.',
    healthSeverity: 'minor',
  },
  {
    key: 'G',
    name: 'Burgundy (G)',
    alleles: 'G (dominant) / g (recessive)',
    effect: 'gg produces a warm, reddish-brown dilution called Burgundy. When combined with Pearl (pp), it creates the Amber phenotype. With both Pearl and Mansfield Pearl (pp + ss), it produces Pearl Amber with distinctive green eyes.',
    health: null,
  },
  {
    key: 'P',
    name: 'Pearl (P)',
    alleles: 'P (dominant) / p (recessive)',
    effect: 'pp creates the Pearl phenotype — a soft, pale coat with reduced pigment intensity. Pearl interacts heavily with Burgundy and Mansfield Pearl to produce Amber, Sapphire, and Pearl Amber combinations. On a pure Red base, Pearl expression is masked.',
    health: null,
  },
  {
    key: 'SS',
    name: 'Mansfield Pearl (SS)',
    alleles: 'S (dominant) / s (recessive)',
    effect: 'ss (homozygous) produces the Mansfield Pearl phenotype — a distinct pale/silvery dilution. Combined with Pearl, it produces Sapphire. With both Pearl and Burgundy, it creates Pearl Amber. Mansfield Pearl also suppresses Fire Factor expression.',
    health: null,
  },
  {
    key: 'Fire',
    name: 'Fire Factor (Fire)',
    alleles: 'FI (dominant) / fi (recessive)',
    effect: 'fifi (homozygous) produces the Fire Factor — a striking orange-gold flush of color across the coat, most visible on silver and cross bases. The resulting phenotype depends on the base: Wildfire (Red), Golden Sunrise (Gold), Colicott (Alaskan Silver), Fire Cross (Cross bases). Fire is suppressed by Mansfield Pearl.',
    health: null,
  },
  {
    key: 'W',
    name: 'White Markings (W)',
    alleles: 'w (no marking) / W (White Mark) / Wp (Platinum) / WM (Marble) / WG (Georgian)',
    effect: 'Controls white patterning on the coat. A fox can carry multiple W alleles, producing layered patterns. White Mark (W) adds small white patches, Platinum (Wp) creates a washed-out silvery effect, Marble (WM) produces irregular high-white marbling, and Georgian (WG) adds georgian-style marks.',
    health: 'Homozygous white alleles (WW, WpWp, WMWM, WGWG) are lethal — kits do not survive. Always breed white-marked foxes to non-white to avoid lethal combinations.',
    healthSeverity: 'lethal',
  },
  {
    key: 'L',
    name: 'Leucistic (L)',
    alleles: 'L (dominant) / l (recessive)',
    effect: 'll (homozygous recessive) produces a white coat with blue eyes — the Leucistic phenotype. Unlike Albino, pigment cells are present but non-functional in the skin, so eye color can be blue or grey. Leucism masks all other coat colors.',
    health: 'Leucistic foxes may have a higher incidence of deafness and vision irregularities associated with the absence of melanocytes in the inner ear and eye.',
    healthSeverity: 'minor',
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-folksy text-foreground tracking-tight flex items-center gap-3" style={{ fontWeight: 400 }}>
          <HelpCircle className="text-primary" size={40} /> Help Center
        </h1>
        <p className="text-muted-foreground mt-4 text-lg font-medium">Learn the basics of breeding, showing, and managing your kennel.</p>
      </div>

      <div className="space-y-10 pb-20">

        {/* Getting Started */}
        <section className="space-y-6">
          <SectionHeader icon={Book} label="Getting Started" />
          <Card className="folk-card border-border bg-card">
            <CardContent className="pt-8 space-y-6">
              <InfoTile icon={Zap} color="bg-primary/10 text-primary border-primary/20" title="Your First Foxes">
                Visit the <strong>Foundation Adoption</strong> shop to buy your first pair. Look for complementary stats and genotypes to begin a strong lineage.
              </InfoTile>
              <InfoTile icon={Heart} color="bg-secondary/10 text-secondary border-secondary/20" title="Breeding Basics">
                Breeding occurs in <strong>Winter</strong>. Select a Sire and Dam on the Breeding page and review the Breeding Insights panel for predicted outcomes and COI (Coefficient of Inbreeding). Avoid high COI pairings to prevent genetic health issues.
              </InfoTile>
            </CardContent>
          </Card>
        </section>

        {/* Showing Your Foxes */}
        <section className="space-y-6">
          <SectionHeader icon={Trophy} label="Showing Your Foxes" />
          <Card className="folk-card border-border bg-card">
            <CardContent className="pt-8 space-y-6">
              <InfoTile icon={Trophy} color="bg-primary/10 text-primary border-primary/20" title="How Shows Work">
                Shows run automatically each season. Every fox you own is evaluated across 8 physical and behavioral traits. A composite score is calculated and compared against all other entrants. Placements earn <strong>Gold</strong> and contribute to your kennel reputation.
              </InfoTile>
              <InfoTile icon={Zap} color="bg-secondary/10 text-secondary border-secondary/20" title="Show Classes">
                Foxes compete in the class matching their age and registration status. Younger foxes may compete in kit and junior classes, while mature foxes enter open and champion classes. Higher classes offer better payouts.
              </InfoTile>
              <InfoTile icon={Info} color="bg-muted text-muted-foreground border-border" title="Improving Show Performance">
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>Hire a <strong>Groomer</strong> for a +5 Coat Quality bonus to all foxes.</li>
                  <li>Hire a <strong>Veterinarian</strong> for a +1 bonus to all physical traits for kits.</li>
                  <li>Breed for high base stats — stats are heritable and compound across generations.</li>
                  <li>Certain colors and patterns may be preferred in specialty shows (check the Shows page for active class details).</li>
                </ul>
              </InfoTile>
              <div className="p-4 bg-muted/50 rounded-2xl border border-border">
                <span className="font-black text-primary block text-xs uppercase tracking-widest mb-1">The 8 Show Traits</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                  {['Head', 'Topline', 'Hindquarters', 'Forequarters', 'Presence', 'Temperament', 'Coat Quality', 'Tail'].map(stat => (
                    <div key={stat} className="p-2 bg-background/60 rounded-xl border border-border text-center">
                      <span className="font-black text-foreground text-[10px] uppercase tracking-widest">{stat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Genetics & Stats */}
        <section className="space-y-6">
          <SectionHeader icon={Microscope} label="Genetics & Stats" />
          <Card className="folk-card border-border bg-card">
            <CardContent className="pt-8 space-y-8">

              {/* How genetics work overview */}
              <div className="space-y-4">
                <h3 className="font-black text-foreground text-lg italic">How Genetics Work</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every fox carries <strong>two copies</strong> of every gene — one inherited from each parent. This is called a <em>diploid</em> system, the same way real mammal genetics work. Each gene copy is called an <strong>allele</strong>, and the pair together is the <strong>genotype</strong>.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Alleles are either <strong>Dominant</strong> (written in UPPERCASE, e.g. <code className="bg-muted px-1 rounded text-xs font-mono">B</code>) or <strong>Recessive</strong> (lowercase, e.g. <code className="bg-muted px-1 rounded text-xs font-mono">b</code>). A dominant allele only needs <em>one</em> copy to show its effect. A recessive allele requires <em>two</em> copies (homozygous) to be visible.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Homozygous Dominant', example: 'BB', desc: 'Two dominant copies. Trait expresses. Cannot carry recessive.' },
                    { label: 'Heterozygous', example: 'Bb', desc: 'One of each. Dominant trait shows. Fox is a hidden carrier of recessive.' },
                    { label: 'Homozygous Recessive', example: 'bb', desc: 'Two recessive copies. Recessive trait fully expresses.' },
                  ].map(g => (
                    <div key={g.label} className="p-3 bg-muted/40 rounded-2xl border border-border">
                      <code className="font-mono text-primary font-black text-lg block mb-1">{g.example}</code>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 block mb-1">{g.label}</span>
                      <p className="text-xs text-muted-foreground">{g.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  When two foxes breed, each parent randomly contributes <em>one</em> of their two alleles at each locus to each kit. The Breeding Calculator simulates 1,000 trials to estimate likely phenotype outcomes and flag high-inbreeding risks.
                </p>
              </div>

              <hr className="border-border" />

              {/* Color Loci */}
              <div className="space-y-6">
                <h3 className="font-black text-foreground text-lg italic">Color Loci Reference</h3>
                <p className="text-sm text-muted-foreground">Nine genetic loci control coat color and pattern. Each locus interacts with others to produce a wide variety of phenotypes.</p>
                <div className="space-y-5">
                  {loci.map(locus => (
                    <div key={locus.key} className="p-4 bg-muted/30 rounded-2xl border border-border space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-foreground text-base">{locus.name}</span>
                        {locus.health && (
                          locus.healthSeverity === 'lethal'
                            ? <LocusBadge label="⚠ Lethal Combo Possible" color="bg-destructive/15 text-destructive" />
                            : <LocusBadge label="Minor Health Note" color="bg-primary/15 text-primary" />
                        )}
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Alleles: {locus.alleles}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{locus.effect}</p>
                      {locus.health && (
                        <div className={`flex gap-2 items-start p-3 rounded-xl border mt-1 ${locus.healthSeverity === 'lethal' ? 'bg-destructive/10 border-destructive/20' : 'bg-primary/5 border-primary/15'}`}>
                          <AlertTriangle size={14} className={locus.healthSeverity === 'lethal' ? 'text-destructive shrink-0 mt-0.5' : 'text-primary shrink-0 mt-0.5'} />
                          <p className="text-xs text-muted-foreground leading-relaxed"><strong className={locus.healthSeverity === 'lethal' ? 'text-destructive' : 'text-primary'}>Health Note: </strong>{locus.health}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>
        </section>

        {/* Kennel Services */}
        <section className="space-y-6">
          <SectionHeader icon={Zap} label="Kennel Services" />
          <Card className="folk-card border-border bg-card">
            <CardContent className="pt-8 space-y-4">
              <div className="space-y-4">
                {[
                  { label: 'Groomer', desc: '+5 Coat Quality bonus for all foxes.' },
                  { label: 'Veterinarian', desc: '+1 bonus to all physical traits for kits.' },
                  { label: 'Geneticist', desc: 'Automatically reveals genotypes for all owned foxes.' },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-3">
                    <Badge className="bg-primary/20 text-primary border-none">{s.label}</Badge>
                    <span className="text-muted-foreground text-sm font-medium">{s.desc}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Gem Shop */}
        <section className="space-y-6">
          <SectionHeader icon={Zap} label="The Gem Shop" />
          <Card className="folk-card border-border bg-card">
            <CardContent className="pt-8 space-y-4">
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">Gems (Emeralds) unlock the most powerful tools in the simulation.</p>
              <ul className="space-y-3">
                <li className="flex gap-3 items-center">
                  <Badge variant="outline" className="text-xs border-primary text-primary">Custom Designer</Badge>
                  <span className="text-xs text-muted-foreground font-medium">Design a fox with a precise genetic blueprint.</span>
                </li>
                <li className="flex gap-3 items-center">
                  <Badge variant="outline" className="text-xs border-secondary text-secondary">Specialty Items</Badge>
                  <span className="text-xs text-muted-foreground font-medium">Buy Genetic Tests, Medicine, and Calculators.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}
