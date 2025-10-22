-- Create lectures table
CREATE TABLE public.lectures (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  class_name text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  day_of_week text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Teachers can view their own lectures"
ON public.lectures
FOR SELECT
USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can create their own lectures"
ON public.lectures
FOR INSERT
WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update their own lectures"
ON public.lectures
FOR UPDATE
USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their own lectures"
ON public.lectures
FOR DELETE
USING (auth.uid() = teacher_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_lectures_updated_at
BEFORE UPDATE ON public.lectures
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.lectures;