import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const FormSelect = ({
  placeholder,
  options,
  value,
  onChange,
  onBlur,
  name,
  ...props
}: {
  placeholder: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
}) => (
  <Select value={value} onValueChange={onChange} {...props}>
    <SelectTrigger onBlur={onBlur}>
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);
