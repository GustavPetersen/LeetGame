import traceback

def normalize_result(function_name, result):
    if function_name in {"intersection", "top_k_frequent"} and isinstance(result, list):
        return sorted(result)

    if function_name == "group_anagrams" and isinstance(result, list):
        return sorted([sorted(group) for group in result])

    return result

def judge_python_submission(code: str, function_name: str, test_cases):
    namespace = {}

    try:
        exec(code, namespace)
    except Exception as e:
        return {
            "verdict": "runtime_error",
            "error": f"Code execution failed:\n{traceback.format_exc()}",
        }

    solution_class = namespace.get("Solution")
    if solution_class is None:
        return {
            "verdict": "runtime_error",
            "error": "Solution class not found.",
        }

    try:
        solution_instance = solution_class()
        submitted_function = getattr(solution_instance, function_name)
    except AttributeError:
        return {
            "verdict": "runtime_error",
            "error": f"Function '{function_name}' not found in Solution class.",
        }

    for test_case in test_cases:
        try:
            args = test_case.input_data
            expected = test_case.expected_output

            if not isinstance(args, list):
                return {
                    "verdict": "runtime_error",
                    "error": "Test case input_data must be a JSON array.",
                }

            result = submitted_function(*args)
            result = normalize_result(function_name, result)

            if result != expected:
                return {
                    "verdict": "wrong_answer",
                    "failed_test_case": test_case.order,
                    "expected": expected,
                    "got": result,
                }

        except Exception:
            return {
                "verdict": "runtime_error",
                "error": traceback.format_exc(),
            }

    return {"verdict": "accepted"}