'use client';

import { Builder, withChildren } from '@builder.io/react';
import { builder } from '@builder.io/sdk';

import { WelcomeBanner } from './homepage/WelcomeBanner';
import { SurveyCard } from './homepage/SurveyCard';
import { ActionCards } from './homepage/ActionCards';
import { FeatureList } from './homepage/FeatureList';
import { CourseCard } from './courses/CourseCard';
import { CompletionCard } from './courses/CompletionCard';
import Section from './common/Section';
import { AutoDocumentationSection, DocumentsCard } from './courses/DocumentationCard';
import { DOCTYPES } from '@/types/builder';
import { CollapsibleCard } from './common/CollapsibleCard';
// import QuizSection from './courses/Quiz';

builder.init('2fb19aaf0dcf4690970b30a8d97097ea');

Builder.register('insertMenu', {
  name: 'Learning Blocks',
  items: [
    { name: 'Banner' },
    { name: 'Feature List' },
    { name: 'Survey Card' },
    { name: 'Action Cards' },
  ],
});

Builder.register('insertMenu', {
  name: 'Course Blocks',
  items: [
    { name: 'CourseCard' },
    { name: 'Completion Card' },
    { name: 'Quiz' },
    { name: 'DocumentsCard' },
    { name: 'TitleSection' },
    { name: 'CollapsibleCard' },
  ],
});

// Register components
Builder.registerComponent(WelcomeBanner, {
  name: 'Banner',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F2fb19aaf0dcf4690970b30a8d97097ea%2F50be8ab5ef74461e85ec917f07fed934',
  inputs: [
    {
      name: 'title',
      type: 'string',
      required: true,
      defaultValue: 'Welcome to Builder Academy',
    },
  ],
});

Builder.registerComponent(SurveyCard, {
  name: 'Survey Card',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F2fb19aaf0dcf4690970b30a8d97097ea%2F5399bfbf652c4630902bc15fa1454185',
  inputs: [
    {
      name: 'title',
      type: 'string',
      required: true,
      defaultValue: 'Help Us Improve Your Learning Experience',
    },
    {
      name: 'description',
      type: 'string',
      required: true,
      defaultValue:
        'Take a quick survey to customize your learning journey and help us provide better content.',
    },
    {
      name: 'buttonText',
      type: 'string',
      required: true,
      defaultValue: 'Take Survey',
    },
    {
      name: 'typeformId',
      type: 'string',
      required: true,
      defaultValue: 'xtCFT5c5',
    },
  ],
});

Builder.registerComponent(ActionCards, {
  name: 'Action Cards',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F2fb19aaf0dcf4690970b30a8d97097ea%2F09e0796c11d04f33b0f415ff33ede9b5',
  inputs: [
    {
      name: 'cards',
      type: 'list',
      subFields: [
        {
          name: 'title',
          type: 'string',
          required: true,
        },
        {
          name: 'description',
          type: 'string',
          required: true,
        },
        {
          name: 'buttonText',
          type: 'string',
          required: true,
        },
        {
          name: 'buttonLink',
          type: 'string',
          required: true,
        },
      ],
      defaultValue: [
        {
          title: 'Start Learning',
          description: 'Explore our courses designed for all skill levels.',
          buttonText: 'View Courses',
          buttonLink: '/courses',
        },
        {
          title: 'Get Certified',
          description: 'Validate your Builder.io skills with our certification program.',
          buttonText: 'Learn More',
          buttonLink: '/certification',
        },
      ],
    },
  ],
  defaults: {
    bindings: {
      'style.color': 'black',
    },
  },
});

Builder.registerComponent(FeatureList, {
  name: 'Feature List',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F2fb19aaf0dcf4690970b30a8d97097ea%2Fdf85bc89236d40a5a10a2b3bf874ea5a',
  inputs: [
    {
      name: 'title',
      type: 'string',
      defaultValue: 'Why Builder Academy?',
    },
    {
      name: 'features',
      type: 'list',
      subFields: [
        {
          name: 'text',
          type: 'string',
          defaultValue: 'Feature item',
        },
      ],
      defaultValue: [
        { text: 'Learn directly from Builder.io experts' },
        { text: 'Practical, hands-on courses' },
        { text: 'Stay updated with the latest features and best practices' },
        { text: 'Connect with the Builder.io community' },
      ],
    },
  ],
  defaultStyles: {
    paddingTop: '20px',
    paddingBottom: '20px',
  },
});

// Register components that need visual customization
Builder.registerComponent(CourseCard, {
  name: 'CourseCard',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F2fb19aaf0dcf4690970b30a8d97097ea%2Fba5c2eff2ca0415da99ed317aa7597d4',
  inputs: [
    {
      name: 'course',
      type: 'reference',
      model: 'course',
      required: true,
    },
    {
      name: 'showDescription',
      type: 'boolean',
      defaultValue: true,
    },
    {
      name: 'showInstructor',
      type: 'boolean',
      defaultValue: true,
    },
  ],
});

Builder.registerComponent(CompletionCard, {
  name: 'Completion Card',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F2fb19aaf0dcf4690970b30a8d97097ea%2Fd0e910dc587449b78a96fc58d973175d',
  inputs: [
    {
      name: 'course',
      type: 'object',
      defaultValue: {
        id: 'intro-to-builder',
        title: 'Introduction to Builder.io',
        level: 'Builder 101',
        modules: [],
        duration: '30 minutes',
        instructor: {
          name: 'Builder Team',
        },
      },
      subFields: [
        {
          name: 'id',
          type: 'string',
          required: true,
          defaultValue: 'intro-to-builder',
        },
        {
          name: 'title',
          type: 'string',
          required: true,
          defaultValue: 'Introduction to Builder.io',
        },
      ],
    },
    {
      name: 'completionDate',
      type: 'date',
      defaultValue: new Date().toISOString(),
    },
    {
      name: 'score',
      type: 'number',
      defaultValue: 100,
    },
    {
      name: 'showCertificateButton',
      type: 'boolean',
      defaultValue: true,
    },
    {
      name: 'certificateUrl',
      type: 'string',
      defaultValue: '/certification',
      showIf: options => options.get('showCertificateButton'),
    },
    {
      name: 'showShareButtons',
      type: 'boolean',
      defaultValue: true,
    },
  ],
  defaultStyles: {
    margin: '10px',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
});

// Builder.registerComponent(QuizSection, {
//   name: 'Quiz',
//   image:
//     'https://cdn.builder.io/api/v1/image/assets%2F2fb19aaf0dcf4690970b30a8d97097ea%2F17331030493a4fcf88baa6f2cb3fb826',
//   inputs: [
//     {
//       name: 'questions',
//       type: 'list',
//       subFields: [
//         {
//           name: 'question',
//           type: 'reference',
//           model: 'quizz-question',
//         },
//       ],
//     },
//     {
//       name: 'title',
//       type: 'string',
//       defaultValue: 'Quiz',
//     },
//     {
//       name: 'passingScore',
//       type: 'number',
//       defaultValue: 70,
//     },
//     {
//       name: 'successMessage',
//       type: 'string',
//       defaultValue: "Congratulations! You've passed the quiz.",
//     },
//     {
//       name: 'failureMessage',
//       type: 'string',
//       defaultValue: "You didn't pass. Please try again.",
//     },
//   ],
// });

Builder.registerComponent(AutoDocumentationSection, {
  name: 'DocumentationSection',
  friendlyName: 'Documents',
  hideFromInsertMenu: true,
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F2fb19aaf0dcf4690970b30a8d97097ea%2F8fbaffa89025469cab9bb125ef4c0fae',
  defaults: {
    responsiveStyles: {
      large: {
        marginTop: '0',
        display: 'block',
      },
    },
  },
  inputs: [
    {
      name: 'docs',
      type: 'list',
      subFields: [
        {
          name: 'url',
          type: 'url',
          required: true,
        },
        {
          name: 'linkText',
          type: 'string',
        },
        {
          name: 'description',
          type: 'string',
        },
        {
          name: 'docType',
          type: 'string',
          defaultValue: 'article',
          enum: DOCTYPES,
        },
      ],
    },
  ],
});

Builder.registerComponent(DocumentsCard, {
  name: 'DocumentsCard',
  friendlyName: 'Documents',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F2fb19aaf0dcf4690970b30a8d97097ea%2F8fbaffa89025469cab9bb125ef4c0fae',
  defaults: {
    responsiveStyles: {
      large: {
        marginTop: '0',
        display: 'block',
      },
    },
  },
  inputs: [
    {
      name: 'title',
      type: 'string',
      defaultValue: 'Documentation',
    },
    {
      name: 'docs',
      type: 'list',
      subFields: [
        {
          name: 'url',
          type: 'url',
          required: true,
        },
        {
          name: 'linkText',
          type: 'string',
        },
        {
          name: 'description',
          type: 'string',
        },
        {
          name: 'docType',
          type: 'string',
          defaultValue: 'article',
          enum: DOCTYPES,
        },
      ],
    },
    {
      name: 'isExpandable',
      type: 'boolean',
      defaultValue: true,
    },
    {
      name: 'startExpanded',
      type: 'boolean',
      defaultValue: true,
      showIf: options => options.get('isExpandable'),
    },
  ],
});

Builder.registerComponent(withChildren(Section), {
  name: 'TitleSection',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F2fb19aaf0dcf4690970b30a8d97097ea%2F1c3524ce90644656b62550a5bfbd191a',
  inputs: [
    {
      name: 'title',
      type: 'string',
      helperText: 'Optional',
    },
  ],
  canHaveChildren: true,
  defaultStyles: {
    marginTop: '0',
    display: 'block',
  },
});

Builder.registerComponent(withChildren(CollapsibleCard), {
  name: 'CollapsibleCard',
  friendlyName: 'Card',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2F2fb19aaf0dcf4690970b30a8d97097ea%2Ff6f70478a34c476784250ee331fd3db9',
  canHaveChildren: true,
  defaultStyles: {
    marginTop: '0',
    display: 'block',
  },
  inputs: [
    {
      name: 'title',
      type: 'string',
      required: true,
    },
    {
      name: 'isExpandable',
      type: 'boolean',
    },
    {
      name: 'startExpanded',
      type: 'boolean',
      showIf: options => options.get('isExpandable'),
    },
  ],
});
