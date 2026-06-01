import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';

interface Resource { title: string; summary: string; slug: string; tag: string; }

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Link to={`/resources#${resource.slug}`} className="card p-5 hover:shadow-md transition-all group flex flex-col">
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 bg-sand rounded-lg shrink-0">
          <BookOpen size={16} className="text-navy" />
        </div>
        <span className="badge bg-teal-light text-teal-dark text-xs">{resource.tag}</span>
      </div>
      <h3 className="font-semibold text-primary group-hover:text-teal transition-colors mb-2 leading-snug">{resource.title}</h3>
      <p className="text-sm text-muted flex-1">{resource.summary}</p>
      <div className="mt-4 flex items-center gap-1 text-teal text-sm font-semibold">Read More <ArrowRight size={13} /></div>
    </Link>
  );
}

export const RESOURCES = [
  { title: 'How to Compare Myrtle Beach New Home Builders', summary: 'Key factors to consider when evaluating national vs. regional builders, including reputation, warranty, and design flexibility.', slug: 'compare-builders', tag: 'Buyer Guide' },
  { title: "What 'Future Subdivision' Means", summary: 'Future subdivisions are planned but unconfirmed communities. Learn what details are typically missing and how to stay updated.', slug: 'future-subdivision', tag: 'Terminology' },
  { title: 'Questions to Ask Before Visiting a Model Home', summary: 'Maximize your model home visit with targeted questions about incentives, lot availability, construction timelines, and more.', slug: 'model-home-questions', tag: 'Buyer Guide' },
  { title: 'Understanding Starting Prices and Builder Incentives', summary: "Starting prices reflect base models on standard lots. Learn how upgrades, lot premiums, and incentives affect your final price.", slug: 'starting-prices', tag: 'Pricing' },
  { title: 'New Construction vs. Recently Completed Communities', summary: 'Explore the differences between buying in an active community vs. browsing completed neighborhoods for resale opportunities.', slug: 'new-vs-completed', tag: 'Strategy' },
  { title: 'Popular Grand Strand Areas for New Construction', summary: 'An overview of the most active new construction corridors — from Conway and Longs to Carolina Forest and North Myrtle Beach.', slug: 'popular-areas', tag: 'Areas' },
  { title: 'What to Verify Before Signing a New Construction Contract', summary: 'Critical steps every buyer should take before committing: lot surveys, HOA docs, builder reviews, and independent inspections.', slug: 'contract-checklist', tag: 'Buyer Guide' },
];
