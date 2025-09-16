import React from 'react'
import {
  FormControl,
  FormDescription,
  FormField as ShadcnFormField, // Renamed to avoid conflict with component name
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'


interface FormFieldProps<T extends FieldValues>{
  control:Control<T>;
  name:FieldPath<T>;
  label:string;
  placeholder?:string;
  type?:'text' | 'email' | 'password' | 'file'
}

const FormField = <T extends FieldValues>({control,name,label,placeholder,type="text"}:FormFieldProps<T>) => {
  return (
    <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel className='label'>{label}</FormLabel>
              <FormControl>
                <Input placeholder={placeholder} type={type} {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
  )
}

export default FormField
