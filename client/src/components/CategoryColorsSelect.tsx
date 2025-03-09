import {
  fetchCategoryColors,
  getCategoryColorHash,
  getCategoryColorId,
  getCategoryColorsFromFetchCategoryColorsResponse,
} from "@/lib/services/categories.service";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { useQuery } from "@tanstack/react-query";
import { ComponentProps } from "react";

interface CategoryColorTileProps {
  colorHash: string;
}

function CategoryColorTile({ colorHash }: CategoryColorTileProps) {
  return <div className="w-4 h-4 rounded" style={{ backgroundColor: colorHash }} />;
}

interface CategoryColorsSelectProps {
  value: ComponentProps<typeof Select>["value"];
  onChange: ComponentProps<typeof Select>["onValueChange"];
}

export function CategoryColorsSelect({
  value,
  onChange,
}: CategoryColorsSelectProps) {
  const { data } = useQuery({
    queryKey: ["categoryColors"],
    queryFn: fetchCategoryColors,
  });

  if (!data) {
    return "Loading...";
  }

  const colors = getCategoryColorsFromFetchCategoryColorsResponse(data);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {colors.map((color) => (
          <SelectItem
            key={getCategoryColorId(color)}
            value={getCategoryColorHash(color)}
          >
            <div className="flex gap-x-2 items-center">
              <CategoryColorTile colorHash={getCategoryColorHash(color)} />
              <p>{color.name}</p>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
