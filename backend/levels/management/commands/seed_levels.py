from django.core.management.base import BaseCommand
from levels.models import Level, LevelTestCase


LEVELS_DATA = [
    # ---------------------------
    # Chapter 1 — Arrays
    # ---------------------------
    {
        "title": "Two Sum",
        "slug": "two-sum",
        "description": "Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.",
        "difficulty": "easy",
        "order": 1,
        "chapter": "Arrays",
        "chapter_order": 1,
        "node_type": "normal",
        "starter_code_python": "class Solution:\n    def two_sum(self, nums, target):\n        pass\n",
        "function_name": "two_sum",
        "is_active": True,
        "tests": [
            {"input_data": [[2, 7, 11, 15], 9], "expected_output": [0, 1], "is_hidden": False, "order": 1},
            {"input_data": [[3, 2, 4], 6], "expected_output": [1, 2], "is_hidden": False, "order": 2},
            {"input_data": [[3, 3], 6], "expected_output": [0, 1], "is_hidden": True, "order": 3},
        ],
    },
    {
        "title": "Contains Duplicate",
        "slug": "contains-duplicate",
        "description": "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
        "difficulty": "easy",
        "order": 2,
        "chapter": "Arrays",
        "chapter_order": 1,
        "node_type": "normal",
        "starter_code_python": "class Solution:\n    def contains_duplicate(self, nums):\n        pass\n",
        "function_name": "contains_duplicate",
        "is_active": True,
        "tests": [
            {"input_data": [[1, 2, 3, 1]], "expected_output": True, "is_hidden": False, "order": 1},
            {"input_data": [[1, 2, 3, 4]], "expected_output": False, "is_hidden": False, "order": 2},
            {"input_data": [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], "expected_output": True, "is_hidden": True, "order": 3},
        ],
    },
    {
        "title": "Best Time to Buy and Sell Stock",
        "slug": "best-time-to-buy-and-sell-stock",
        "description": "You are given an array prices where prices[i] is the price of a given stock on the ith day. Return the maximum profit you can achieve from a single buy and sell.",
        "difficulty": "easy",
        "order": 3,
        "chapter": "Arrays",
        "chapter_order": 1,
        "node_type": "boss",
        "starter_code_python": "class Solution:\n    def max_profit(self, prices):\n        pass\n",
        "function_name": "max_profit",
        "is_active": True,
        "tests": [
            {"input_data": [[7, 1, 5, 3, 6, 4]], "expected_output": 5, "is_hidden": False, "order": 1},
            {"input_data": [[7, 6, 4, 3, 1]], "expected_output": 0, "is_hidden": False, "order": 2},
            {"input_data": [[2, 4, 1]], "expected_output": 2, "is_hidden": True, "order": 3},
        ],
    },

    # ---------------------------
    # Chapter 2 — Hashing
    # ---------------------------
    {
        "title": "Valid Anagram",
        "slug": "valid-anagram",
        "description": "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
        "difficulty": "easy",
        "order": 4,
        "chapter": "Hashing",
        "chapter_order": 2,
        "node_type": "normal",
        "starter_code_python": "class Solution:\n    def is_anagram(self, s, t):\n        pass\n",
        "function_name": "is_anagram",
        "is_active": True,
        "tests": [
            {"input_data": ["anagram", "nagaram"], "expected_output": True, "is_hidden": False, "order": 1},
            {"input_data": ["rat", "car"], "expected_output": False, "is_hidden": False, "order": 2},
            {"input_data": ["aacc", "ccac"], "expected_output": False, "is_hidden": True, "order": 3},
        ],
    },
    {
        "title": "Intersection of Two Arrays",
        "slug": "intersection-of-two-arrays",
        "description": "Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must be unique.",
        "difficulty": "easy",
        "order": 5,
        "chapter": "Hashing",
        "chapter_order": 2,
        "node_type": "normal",
        "starter_code_python": "class Solution:\n    def intersection(self, nums1, nums2):\n        pass\n",
        "function_name": "intersection",
        "is_active": True,
        "tests": [
            {"input_data": [[1, 2, 2, 1], [2, 2]], "expected_output": [2], "is_hidden": False, "order": 1},
            {"input_data": [[4, 9, 5], [9, 4, 9, 8, 4]], "expected_output": [9, 4], "is_hidden": False, "order": 2},
            {"input_data": [[1, 3, 5], [2, 4, 6]], "expected_output": [], "is_hidden": True, "order": 3},
        ],
    },
    {
        "title": "Top K Frequent Elements",
        "slug": "top-k-frequent-elements",
        "description": "Given an integer array nums and an integer k, return the k most frequent elements.",
        "difficulty": "medium",
        "order": 6,
        "chapter": "Hashing",
        "chapter_order": 2,
        "node_type": "boss",
        "starter_code_python": "class Solution:\n    def top_k_frequent(self, nums, k):\n        pass\n",
        "function_name": "top_k_frequent",
        "is_active": True,
        "tests": [
            {"input_data": [[1, 1, 1, 2, 2, 3], 2], "expected_output": [1, 2], "is_hidden": False, "order": 1},
            {"input_data": [[1], 1], "expected_output": [1], "is_hidden": False, "order": 2},
            {"input_data": [[4, 4, 4, 5, 5, 6], 1], "expected_output": [4], "is_hidden": True, "order": 3},
        ],
    },

    # ---------------------------
    # Chapter 3 — Strings
    # ---------------------------
    {
        "title": "Valid Palindrome",
        "slug": "valid-palindrome",
        "description": "Given a string s, return true if it is a palindrome after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters.",
        "difficulty": "easy",
        "order": 7,
        "chapter": "Strings",
        "chapter_order": 3,
        "node_type": "normal",
        "starter_code_python": "class Solution:\n    def is_palindrome(self, s):\n        pass\n",
        "function_name": "is_palindrome",
        "is_active": True,
        "tests": [
            {"input_data": ["A man, a plan, a canal: Panama"], "expected_output": True, "is_hidden": False, "order": 1},
            {"input_data": ["race a car"], "expected_output": False, "is_hidden": False, "order": 2},
            {"input_data": [" "], "expected_output": True, "is_hidden": True, "order": 3},
        ],
    },
    {
        "title": "Longest Common Prefix",
        "slug": "longest-common-prefix",
        "description": "Write a function to find the longest common prefix string amongst an array of strings.",
        "difficulty": "easy",
        "order": 8,
        "chapter": "Strings",
        "chapter_order": 3,
        "node_type": "normal",
        "starter_code_python": "class Solution:\n    def longest_common_prefix(self, strs):\n        pass\n",
        "function_name": "longest_common_prefix",
        "is_active": True,
        "tests": [
            {"input_data": [["flower", "flow", "flight"]], "expected_output": "fl", "is_hidden": False, "order": 1},
            {"input_data": [["dog", "racecar", "car"]], "expected_output": "", "is_hidden": False, "order": 2},
            {"input_data": [["interspecies", "interstellar", "interstate"]], "expected_output": "inters", "is_hidden": True, "order": 3},
        ],
    },
    {
        "title": "Group Anagrams",
        "slug": "group-anagrams",
        "description": "Given an array of strings strs, group the anagrams together. You may return the answer in any order.",
        "difficulty": "medium",
        "order": 9,
        "chapter": "Strings",
        "chapter_order": 3,
        "node_type": "boss",
        "starter_code_python": "class Solution:\n    def group_anagrams(self, strs):\n        pass\n",
        "function_name": "group_anagrams",
        "is_active": True,
        "tests": [
            {
                "input_data": [["eat", "tea", "tan", "ate", "nat", "bat"]],
                "expected_output": [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]],
                "is_hidden": False,
                "order": 1,
            },
            {
                "input_data": [[""]],
                "expected_output": [[""]],
                "is_hidden": False,
                "order": 2,
            },
            {
                "input_data": [["a"]],
                "expected_output": [["a"]],
                "is_hidden": True,
                "order": 3,
            },
        ],
    },

    # ---------------------------
    # Chapter 4 — Stacks
    # ---------------------------
    {
        "title": "Valid Parentheses",
        "slug": "valid-parentheses",
        "description": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
        "difficulty": "easy",
        "order": 10,
        "chapter": "Stacks",
        "chapter_order": 4,
        "node_type": "normal",
        "starter_code_python": "class Solution:\n    def is_valid(self, s):\n        pass\n",
        "function_name": "is_valid",
        "is_active": True,
        "tests": [
            {"input_data": ["()"], "expected_output": True, "is_hidden": False, "order": 1},
            {"input_data": ["()[]{}"], "expected_output": True, "is_hidden": False, "order": 2},
            {"input_data": ["(]"], "expected_output": False, "is_hidden": True, "order": 3},
        ],
    },
    {
        "title": "Baseball Game",
        "slug": "baseball-game",
        "description": "You are keeping score for a baseball game with strange rules. Given a list of strings operations, return the sum of all scores.",
        "difficulty": "easy",
        "order": 11,
        "chapter": "Stacks",
        "chapter_order": 4,
        "node_type": "normal",
        "starter_code_python": "class Solution:\n    def cal_points(self, operations):\n        pass\n",
        "function_name": "cal_points",
        "is_active": True,
        "tests": [
            {"input_data": [["5", "2", "C", "D", "+"]], "expected_output": 30, "is_hidden": False, "order": 1},
            {"input_data": [["5", "-2", "4", "C", "D", "9", "+", "+"]], "expected_output": 27, "is_hidden": False, "order": 2},
            {"input_data": [["1"]], "expected_output": 1, "is_hidden": True, "order": 3},
        ],
    },
    {
        "title": "Daily Temperatures",
        "slug": "daily-temperatures",
        "description": "Given an array of daily temperatures, return an array such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.",
        "difficulty": "medium",
        "order": 12,
        "chapter": "Stacks",
        "chapter_order": 4,
        "node_type": "boss",
        "starter_code_python": "class Solution:\n    def daily_temperatures(self, temperatures):\n        pass\n",
        "function_name": "daily_temperatures",
        "is_active": True,
        "tests": [
            {"input_data": [[73, 74, 75, 71, 69, 72, 76, 73]], "expected_output": [1, 1, 4, 2, 1, 1, 0, 0], "is_hidden": False, "order": 1},
            {"input_data": [[30, 40, 50, 60]], "expected_output": [1, 1, 1, 0], "is_hidden": False, "order": 2},
            {"input_data": [[30, 60, 90]], "expected_output": [1, 1, 0], "is_hidden": True, "order": 3},
        ],
    },

    # ---------------------------
    # Chapter 5 — Binary Search
    # ---------------------------
    {
        "title": "Binary Search",
        "slug": "binary-search",
        "description": "Given a sorted array of integers nums and an integer target, return the index of target if it exists in the array. Otherwise, return -1.",
        "difficulty": "easy",
        "order": 13,
        "chapter": "Binary Search",
        "chapter_order": 5,
        "node_type": "normal",
        "starter_code_python": "class Solution:\n    def search(self, nums, target):\n        pass\n",
        "function_name": "search",
        "is_active": True,
        "tests": [
            {"input_data": [[-1, 0, 3, 5, 9, 12], 9], "expected_output": 4, "is_hidden": False, "order": 1},
            {"input_data": [[-1, 0, 3, 5, 9, 12], 2], "expected_output": -1, "is_hidden": False, "order": 2},
            {"input_data": [[5], 5], "expected_output": 0, "is_hidden": True, "order": 3},
        ],
    },
    {
        "title": "Search Insert Position",
        "slug": "search-insert-position",
        "description": "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be inserted in order.",
        "difficulty": "easy",
        "order": 14,
        "chapter": "Binary Search",
        "chapter_order": 5,
        "node_type": "normal",
        "starter_code_python": "class Solution:\n    def search_insert(self, nums, target):\n        pass\n",
        "function_name": "search_insert",
        "is_active": True,
        "tests": [
            {"input_data": [[1, 3, 5, 6], 5], "expected_output": 2, "is_hidden": False, "order": 1},
            {"input_data": [[1, 3, 5, 6], 2], "expected_output": 1, "is_hidden": False, "order": 2},
            {"input_data": [[1, 3, 5, 6], 7], "expected_output": 4, "is_hidden": True, "order": 3},
        ],
    },
    {
        "title": "Search in Rotated Sorted Array",
        "slug": "search-in-rotated-sorted-array",
        "description": "There is an integer array nums sorted in ascending order, possibly rotated. Given the array after possible rotation and a target, return its index or -1 if it is not found.",
        "difficulty": "medium",
        "order": 15,
        "chapter": "Binary Search",
        "chapter_order": 5,
        "node_type": "boss",
        "starter_code_python": "class Solution:\n    def search(self, nums, target):\n        pass\n",
        "function_name": "search",
        "is_active": True,
        "tests": [
            {"input_data": [[4, 5, 6, 7, 0, 1, 2], 0], "expected_output": 4, "is_hidden": False, "order": 1},
            {"input_data": [[4, 5, 6, 7, 0, 1, 2], 3], "expected_output": -1, "is_hidden": False, "order": 2},
            {"input_data": [[1], 0], "expected_output": -1, "is_hidden": True, "order": 3},
        ],
    },

    # ---------------------------
    # Chapter 6 — Sliding Window
    # ---------------------------
    {
        "title": "Maximum Average Subarray I",
        "slug": "maximum-average-subarray-i",
        "description": "Given an integer array nums and an integer k, find the contiguous subarray of length k that has the maximum average value.",
        "difficulty": "easy",
        "order": 16,
        "chapter": "Sliding Window",
        "chapter_order": 6,
        "node_type": "normal",
        "starter_code_python": "class Solution:\n    def find_max_average(self, nums, k):\n        pass\n",
        "function_name": "find_max_average",
        "is_active": True,
        "tests": [
            {"input_data": [[1, 12, -5, -6, 50, 3], 4], "expected_output": 12.75, "is_hidden": False, "order": 1},
            {"input_data": [[5], 1], "expected_output": 5.0, "is_hidden": False, "order": 2},
            {"input_data": [[0, 4, 0, 3, 2], 1], "expected_output": 4.0, "is_hidden": True, "order": 3},
        ],
    },
    {
        "title": "Longest Substring Without Repeating Characters",
        "slug": "longest-substring-without-repeating-characters",
        "description": "Given a string s, find the length of the longest substring without repeating characters.",
        "difficulty": "medium",
        "order": 17,
        "chapter": "Sliding Window",
        "chapter_order": 6,
        "node_type": "normal",
        "starter_code_python": "class Solution:\n    def length_of_longest_substring(self, s):\n        pass\n",
        "function_name": "length_of_longest_substring",
        "is_active": True,
        "tests": [
            {"input_data": ["abcabcbb"], "expected_output": 3, "is_hidden": False, "order": 1},
            {"input_data": ["bbbbb"], "expected_output": 1, "is_hidden": False, "order": 2},
            {"input_data": ["pwwkew"], "expected_output": 3, "is_hidden": True, "order": 3},
        ],
    },
    {
        "title": "Permutation in String",
        "slug": "permutation-in-string",
        "description": "Given two strings s1 and s2, return true if s2 contains a permutation of s1, or false otherwise.",
        "difficulty": "medium",
        "order": 18,
        "chapter": "Sliding Window",
        "chapter_order": 6,
        "node_type": "boss",
        "starter_code_python": "class Solution:\n    def check_inclusion(self, s1, s2):\n        pass\n",
        "function_name": "check_inclusion",
        "is_active": True,
        "tests": [
            {"input_data": ["ab", "eidbaooo"], "expected_output": True, "is_hidden": False, "order": 1},
            {"input_data": ["ab", "eidboaoo"], "expected_output": False, "is_hidden": False, "order": 2},
            {"input_data": ["adc", "dcda"], "expected_output": True, "is_hidden": True, "order": 3},
        ],
    },
]


def normalize_expected_output(level_slug, expected_output):
    """
    Normalize outputs for judge compatibility.
    Your current judge uses direct equality.
    For problems where order may vary, choose stable expected values.
    """
    if level_slug == "intersection-of-two-arrays":
        return sorted(expected_output)

    if level_slug == "top-k-frequent-elements":
        return sorted(expected_output)

    return expected_output


class Command(BaseCommand):
    help = "Seed levels and test cases for LeetGame"

    def handle(self, *args, **options):
        for item in LEVELS_DATA:
            tests = item.pop("tests", [])

            level, created = Level.objects.update_or_create(
                slug=item["slug"],
                defaults=item,
            )

            level.test_cases.all().delete()

            for test in tests:
                LevelTestCase.objects.create(
                    level=level,
                    input_data=test["input_data"],
                    expected_output=normalize_expected_output(level.slug, test["expected_output"]),
                    is_hidden=test["is_hidden"],
                    order=test["order"],
                )

            self.stdout.write(
                self.style.SUCCESS(
                    f"{'Created' if created else 'Updated'} level: {level.title}"
                )
            )

        self.stdout.write(self.style.SUCCESS("Finished seeding levels and test cases."))