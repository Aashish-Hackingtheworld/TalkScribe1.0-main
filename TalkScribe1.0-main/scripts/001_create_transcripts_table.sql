-- Create transcripts table to store user transcriptions
CREATE TABLE IF NOT EXISTS transcripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  audio_duration INTEGER, -- duration in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_transcripts_user_id ON transcripts(user_id);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_transcripts_created_at ON transcripts(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE transcripts ENABLE ROW LEVEL SECURITY;

-- Create policy so users can only see their own transcripts
CREATE POLICY "Users can view their own transcripts" ON transcripts
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy so users can insert their own transcripts
CREATE POLICY "Users can insert their own transcripts" ON transcripts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy so users can update their own transcripts
CREATE POLICY "Users can update their own transcripts" ON transcripts
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy so users can delete their own transcripts
CREATE POLICY "Users can delete their own transcripts" ON transcripts
  FOR DELETE USING (auth.uid() = user_id);
