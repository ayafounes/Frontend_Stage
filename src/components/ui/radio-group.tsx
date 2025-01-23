// components/ui/radio-group.tsx
import * as React from "react";
import { RadioGroup as RadioGroupPrimitive, RadioGroupItem as RadioGroupItemPrimitive } from "@radix-ui/react-radio-group";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive
      className={`flex flex-col gap-2 ${className}`}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupItemPrimitive>,
  React.ComponentPropsWithoutRef<typeof RadioGroupItemPrimitive>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupItemPrimitive
      className={`h-4 w-4 rounded-full border border-gray-300 text-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 ${className}`}
      {...props}
      ref={ref}
    />
  );
});
RadioGroupItem.displayName = RadioGroupItemPrimitive.displayName;

export { RadioGroup, RadioGroupItem };