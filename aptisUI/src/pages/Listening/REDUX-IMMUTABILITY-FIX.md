# Redux Immutability Fix for Listening Components

## Issue

```
Uncaught TypeError: Cannot assign to read only property '0' of object '[object Array]'
```

This error occurred when navigating to the edit screen because the code was directly mutating Redux state arrays, violating Redux's immutability principle.

## Root Cause

The issue was in the useEffect hooks of Listening components where answerList arrays were being mutated directly:

### Before (Problematic Code)

```typescript
// ❌ Direct mutation - violates immutability
const currentAnswerList = listeningStore?.currentListeningData?.subQuestions?.[num - 1]?.answerList || [...];
currentAnswerList[ansNum - 1] = { content: answerContent }; // This causes the error
```

### After (Fixed Code)

```typescript
// ✅ Create new copy - maintains immutability
const currentAnswerList = listeningStore?.currentListeningData?.subQuestions?.[num - 1]?.answerList || [...];
const newAnswerList = [...currentAnswerList]; // Create new copy
newAnswerList[ansNum - 1] = { content: answerContent }; // Mutate the copy, not original
```

## Files Fixed

### 1. ListeningPartOne.tsx

- **Location**: Line ~657 in useEffect hook when loading existing data
- **Fix**: Added `const newAnswerList = [...currentAnswerList];` before mutation
- **Impact**: Prevents mutation error when editing Part 1 questions

### 2. ListeningPartFour.tsx

- **Location**: Line ~599 in useEffect hook when loading existing data
- **Fix**: Added `const newAnswerList = [...currentAnswerList];` before mutation
- **Impact**: Prevents mutation error when editing Part 4 questions

## Other Files Checked

- **ListeningPartTwo.tsx**: ✅ No issues - already using proper immutable patterns
- **ListeningPartThree.tsx**: ✅ No issues - already using proper immutable patterns

## Technical Details

### Redux Immutability Principle

Redux requires that state updates be immutable. This means:

- Never modify existing state objects/arrays directly
- Always create new copies when updating nested data
- Use spread operator (`...`) or other immutable update patterns

### Why This Error Occurred

1. Redux state objects are frozen in development mode
2. Direct assignment to array indices violates immutability
3. The error is thrown when trying to assign to a read-only property

### Prevention

Always use immutable update patterns:

```typescript
// ✅ Good - Create new array
const newArray = [...oldArray];
newArray[index] = newValue;

// ✅ Good - Use map for updates
const newArray = oldArray.map((item, idx) => (idx === index ? newValue : item));

// ❌ Bad - Direct mutation
oldArray[index] = newValue;
```

## Testing

After the fix:

1. Navigate to Listening edit pages (Part 1, 2, 3, 4)
2. All pages should load without console errors
3. Form data should populate correctly from existing records
4. Redux DevTools should show proper state updates without mutations

## Status

🟢 **RESOLVED** - All mutation issues fixed, edit screens now work properly.
