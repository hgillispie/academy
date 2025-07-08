'use client';

// import { CourseSection as CourseSectionType } from "@/types/course";
import { CourseCard } from './CourseCard';
import { BuilderModel, Course } from '@/types/builder';

/**
 * NOTE: THIS WAS USED FOR HARDCODED DATA BASED TESTING
 * IT HAS NOT BEEN UPDATED TO USE BUILDER.IO MODELS
 * IT HAS BEEN MODIFIED ONLY TO MAKE TS TYPES PASS
 */

interface CourseListProps {
  sections: { title: string; courses: BuilderModel<Course>[] }[];
}

export const CourseList = ({ sections }: CourseListProps) => {
  return (
    <div>{sections?.map(section => <CourseSection key={section.title} section={section} />)}</div>
  );
};

const CourseSection = ({ section }: { section: CourseListProps['sections'][number] }) => {
  return (
    <section className="mb-8">
      <h2 className="text-black text-xl font-normal mb-2">{section.title}</h2>
      <div className="border-t-[#a2a2a2] border-t border-solid">
        {section?.courses?.map(course => <CourseCard key={course.id} course={course} />)}
      </div>
    </section>
  );
};
