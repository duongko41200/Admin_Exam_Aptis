# Sample Data for RAG Writing Scoring System

## Overview

This directory contains sample data files to help you get started with the RAG Writing Scoring System. The data includes scoring rubrics and example writings that demonstrate the system's capabilities.

## Data Files

### 1. `rubrics.json`

Contains scoring rubrics for different Aptis writing tasks:

- **Aptis General Task 1** - Email/Letter writing (50-120 words)
- **Aptis General Task 2** - Article/Report writing (120-180 words)
- **Aptis Advanced Task 1** - Formal correspondence (150-200 words)

Each rubric includes:

- Task description and word count requirements
- Four scoring criteria (Task Fulfillment, Coherence, Vocabulary, Grammar)
- Detailed level descriptors (0-9 scale)
- Sample prompts for each task type

### 2. `sample_writings.json`

Contains 6 example writings across different task types and proficiency levels:

- **Email writings**: Complaint, invitation, job application
- **Article writings**: Technology, travel, environment
- **Various score levels**: From intermediate (6.0) to advanced (8.5)

Each writing includes:

- Complete text and metadata
- Detailed scores for all criteria
- Comprehensive feedback and comments
- Processing information

## Data Structure Examples

### Rubric Structure

```json
{
  "id": "aptis_general_task1",
  "name": "Aptis General Writing Task 1",
  "task_type": "email",
  "word_count": {"min": 50, "max": 120},
  "criteria": {
    "task_fulfillment": {
      "weight": 0.25,
      "levels": {"0-1": "description...", "8-9": "description..."}
    }
  },
  "prompts": [...]
}
```

### Writing Structure

```json
{
  "id": "writing_001",
  "user_id": "user123",
  "task_type": "email",
  "text": "Dear Customer Service...",
  "scores": {
    "overall": 7.5,
    "task_fulfillment": 8,
    "coherence": 7,
    "vocabulary": 7,
    "grammar": 8
  },
  "detailed_feedback": {...}
}
```

## Loading Data into System

### Using the Seed Script

```bash
# Load all sample data (recommended)
node scripts/seedData.js all

# Load only rubrics
node scripts/seedData.js rubrics

# Load only writings
node scripts/seedData.js writings

# Clear existing data
node scripts/seedData.js clear
```

### Manual Loading

You can also load data programmatically:

```javascript
const DataSeeder = require("./scripts/seedData");
const seeder = new DataSeeder();

// Load all data
const result = await seeder.seedAll();
console.log(`Loaded: ${result.rubrics} rubrics, ${result.writings} writings`);
```

## Customizing Sample Data

### Adding New Rubrics

1. Edit `rubrics.json`
2. Follow the existing structure
3. Ensure unique IDs
4. Run the seed script to update

### Adding New Writings

1. Edit `sample_writings.json`
2. Include all required fields
3. Use realistic scores and feedback
4. Run the seed script to update

### Creating New Prompts

Add prompts to existing rubrics:

```json
{
  "id": "new_prompt_id",
  "text": "Write a...",
  "type": "complaint|invitation|article|report",
  "register": "formal|informal|semi-formal"
}
```

## Quality Assurance

### Rubric Validation

- All criteria weights should sum to 1.0
- Level descriptors should cover 0-9 range
- Prompts should match task type and word count

### Writing Validation

- Word count should match rubric requirements
- Scores should be realistic (0-9 scale)
- Feedback should be constructive and specific
- Task type should match existing rubrics

## Best Practices

### For Rubrics

- Keep level descriptors clear and specific
- Ensure criteria are measurable
- Provide varied prompt examples
- Match real Aptis standards

### For Writings

- Include range of proficiency levels
- Provide detailed, actionable feedback
- Use authentic language and errors
- Cover different task types and topics

## Troubleshooting

### Common Issues

1. **File not found**: Ensure you're in the correct directory
2. **JSON parse errors**: Validate JSON syntax
3. **Missing embeddings**: Check if embedding service is running
4. **Storage errors**: Verify database/file permissions

### Debug Mode

Enable detailed logging:

```bash
NODE_ENV=development node scripts/seedData.js all
```

## Next Steps

After loading sample data:

1. Test the RAG system with similar writings search
2. Verify scoring accuracy with known samples
3. Check progress analytics functionality
4. Test suggestion generation

## Contributing

When adding new sample data:

1. Follow existing naming conventions
2. Ensure data quality and accuracy
3. Update this README if needed
4. Test with the seeding script

---

**Note**: This sample data is for demonstration and testing purposes. In production, replace with authentic rubrics and writings appropriate for your specific use case.
