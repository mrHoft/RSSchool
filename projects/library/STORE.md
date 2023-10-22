### Storage structure:

<!-- prettier-ignore -->
```markdown
├── profile
│   ├── id string               // Card id
│   ├── have_card boolean
│   ├── authorized boolean
│   ├── visits number
│   ├── score number
│   ├── books
│   │   ├── Array[string]       // 'Book name By Author'
│   ├── user
│   │   ├── first_name string
│   │   ├── last_name string
│   │   ├── email string
│   │   ├── password string     // This is a task rule
```

### Example methods:

| Command                                  | Description           |
| ---------------------------------------- | --------------------- |
| `const store = new Store()`              | Initialize            |
| `store.get('profile')`                   | Get user profile      |
| `store.set('profile.user', data)`        | Set user data         |
| `store.set('profile.authorized', false)` | Set user unauthorized |
| `store.clear()`                          | Clear sorage          |
