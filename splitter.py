import os
import json


file_path = "./conversations.json"
# Read the file content
with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
  raw_content = f.read()

# Try to parse JSON and pretty-print it, or if too big, split into chunks
try:
  parsed_json = json.loads(raw_content)
  pretty_json = json.dumps(parsed_json, indent=4, ensure_ascii=False)
  output_path = "conversations_pretty.json"
  with open(output_path, "w", encoding="utf-8") as f:
    f.write(pretty_json)
  result = f"Pretty JSON saved to {output_path}"
except json.JSONDecodeError:
  # If JSON is too large or invalid, split the file
  split_files = []
  chunk_size = 10 * 1024 * 1024  # 10 MB
  for i in range(0, len(raw_content), chunk_size):
    chunk_path = f"conversations_part_{i//chunk_size + 1}.txt"
    with open(chunk_path, "w", encoding="utf-8") as cf:
      cf.write(raw_content[i:i+chunk_size])
    split_files.append(chunk_path)
  result = f"File was not valid JSON or too large to parse. Split into: {split_files}"


pretty_path = "conversations_pretty.json"

# Read the pretty JSON
with open(pretty_path, "r", encoding="utf-8") as f:
  pretty_content = f.read()

# Split into 25 MB chunks
chunk_size = 50 * 1024 * 1024
split_paths = []

for i in range(0, len(pretty_content), chunk_size):
  chunk_path = f"conversations_pretty_part_{i//chunk_size + 1}.json"
  with open(chunk_path, "w", encoding="utf-8") as cf:
    cf.write(pretty_content[i:i+chunk_size])
  split_paths.append(chunk_path)


split_paths = []

with open(file_path, "r", encoding="utf-8") as infile:
  part_num = 1
  current_chunk = []
  current_size = 0

  for line in infile:
    encoded_line = line.encode("utf-8")
    line_size = len(encoded_line)

    if current_size + line_size > chunk_size:
      # Save current chunk
      chunk_path = f"conversations_pretty_part_{part_num}.json"
      with open(chunk_path, "w", encoding="utf-8") as cf:
        cf.writelines(current_chunk)
      split_paths.append(chunk_path)

      # Reset for next chunk
      part_num += 1
      current_chunk = []
      current_size = 0

    current_chunk.append(line)
    current_size += line_size

  # Save the last chunk if exists
  if current_chunk:
    chunk_path = f"conversations_pretty_part_{part_num}.json"
    with open(chunk_path, "w", encoding="utf-8") as cf:
      cf.writelines(current_chunk)
    split_paths.append(chunk_path)

print(split_paths)
