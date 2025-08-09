interface FileInputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

export const FileInput: React.FC<FileInputProps> = ({ onChange, disabled }) => (
  <input
    type="file"
    accept="image/*"
    onChange={onChange}
    disabled={disabled}
    className="mb-4 p-2 rounded bg-gray-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 disabled:opacity-50"
  />
);