---
title: 6 VS Code essential extensions
date: 2022-07-21
extract: Boost your coding game with 6 essential VS Code extensions, including GitHub Copilot or Tab9 as a bonus.
technical: true
---

# 6 VS Code essential extensions

Whenever you are just starting out with programming, you have switched to VS Code or even if you already have experience with VS Code, we all may want to discover or rediscover tools that will make us more productive and confident when writing code.

## ESLint and Prettier

This is a very basic tool that will help us to write code in a more consistent way.

> Image of code with warnings, errors and bad formatting

Keep in mind that you will likely want to have them already ... project and have both installed.

```bash
npm install --dev prettier eslint
```

And with a set of existing eslint and prettier rules, there a lot of standards out there, but you can use these I already made team proof.

```bash
npm install --dev eslint-config-cretia prettier-config-cretia
```

And just modify your `package.json` to include the next lines

```json
{
  ...,
  "prettier": "prettier-config-cretia",
  "eslint-config": {
    "extends": "eslint-config-cretia"
  }
}
```

> PS you also may want to update your formatting preferences in VS Code, so when you hit save, the file is automatically formatted.

## Import Cost

When working on frontend code we should be cautious about the amount of code we are importing, popular but large libraries like lodash or moment.js are still spotted in the wild.

> IMAGE of using lodash, moment and node, :(

So please, for the sake of your users, and avoid burning money let's watch out for the number of K's we're using on our projects.

## GitLens

Working with a large project with different contributors, a large history of commits, and a large amount of code, GitLens is a great tool to help us to see the history of our code, blame anyone who has messed up the code (it usually is yourself) and see the history of the code in a more readable way, navigate tru last PRs and more.

> Spiderman meme with caption of who introduced this bug.

## CodeMetrics

We always know when our code stinks, but CodeMetrics will make it clear when we are not following the best practices.

![Complexity 20](/images/complexity-20.png)

> We can see that this component is too complex, and we should refactor it.

![Complexity 20](/images/complexity-6.png)

> Ahh, much better. Smaller components, easier to read and understand.

## Code Spell Checker

We can always improve our writing, but when it comes to code, a misspell is important to catch on, imagine trying to refactor

## Bonus

## GitHub Copilot

Copilot is an amazing project using GPT-3…
A nice alternative in case you can't get the beta right now is Tab9
