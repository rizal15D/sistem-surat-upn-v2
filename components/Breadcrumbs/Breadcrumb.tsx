import Link from "next/link";
interface BreadcrumbProps {
  title: string;
  subtitle?: string[];
}
const Breadcrumb = ({ title, subtitle }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {title}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          {subtitle?.map((item, index) => (
            <Link key={index} className="font-medium" href="#">
              {item}
            </Link>
          ))}
          <li className="font-medium text-primary">{title}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
