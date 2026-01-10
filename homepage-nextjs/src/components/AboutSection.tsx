import Image from "next/image";
import { AboutData } from "@/lib/api";

interface AboutSectionProps {
  data: AboutData;
}

export default function AboutSection({ data }: AboutSectionProps) {
  if (!data.title && !data.description) {
    return null;
  }

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-1360 px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Image */}
          {data.image && (
            <div className="relative aspect-square overflow-hidden rounded-lg lg:aspect-auto lg:h-[600px]">
              <Image
                src={data.image}
                alt={data.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className={!data.image ? "lg:col-span-2 text-center" : ""}>
            <h2 className="mb-6 text-5xl font-bold text-blue">{data.title}</h2>

            {data.description && (
              <div
                className="prose prose-lg max-w-none text-grey"
                dangerouslySetInnerHTML={{ __html: data.description }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
