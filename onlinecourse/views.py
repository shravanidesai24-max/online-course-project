
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db import transaction

from .models import Course, Lesson, Enrollment, Question, Choice, Submission


def course_list(request):
    courses = Course.objects.all().order_by("id")
    return render(
        request,
        "onlinecourse/course_list_bootstrap.html",
        {"course_list": courses, "courses": courses},
    )


def course_details(request, course_id):
    course = get_object_or_404(Course, pk=course_id)
    lessons = course.lessons.all().order_by("order", "id")
    questions = course.questions.prefetch_related("choices").all()

    return render(
        request,
        "onlinecourse/course_details_bootstrap.html",
        {
            "course": course,
            "lessons": lessons,
            "questions": questions,
        },
    )


@login_required
def enroll(request, course_id):
    course = get_object_or_404(Course, pk=course_id)

    if request.method == "POST":
        Enrollment.objects.get_or_create(
            user=request.user,
            course=course,
        )
        messages.success(request, "You are enrolled in this course.")
        return redirect("course_details", course_id=course.id)

    return redirect("course_details", course_id=course.id)


@login_required
def submit(request, course_id):
    course = get_object_or_404(Course, pk=course_id)

    enrollment = Enrollment.objects.filter(
        user=request.user,
        course=course,
    ).first()

    if enrollment is None:
        messages.error(request, "Please enroll in this course before taking the exam.")
        return redirect("course_details", course_id=course.id)

    if request.method != "POST":
        return redirect("course_details", course_id=course.id)

    questions = course.questions.prefetch_related("choices").all()
    selected_choices = []

    for question in questions:
        answer_key = f"question_{question.id}"
        choice_id = request.POST.get(answer_key)

        if choice_id:
            choice = Choice.objects.filter(
                pk=choice_id,
                question=question,
            ).first()

            if choice:
                selected_choices.append(choice)

    with transaction.atomic():
        submission = Submission.objects.create(enrollment=enrollment)
        submission.choices.set(selected_choices)

    return redirect("show_exam_result", submission_id=submission.id)


@login_required
def show_exam_result(request, submission_id):
    submission = get_object_or_404(
        Submission.objects.select_related(
            "enrollment__course",
            "enrollment__user",
        ).prefetch_related("choices__question"),
        pk=submission_id,
        enrollment__user=request.user,
    )

    course = submission.enrollment.course
    questions = course.questions.prefetch_related("choices").all()

    total_grade = sum(question.grade for question in questions)

    correct_choice_ids = set(
        Choice.objects.filter(
            question__course=course,
            is_correct=True,
        ).values_list("id", flat=True)
    )

    submitted_choice_ids = set(
        submission.choices.values_list("id", flat=True)
    )

    score = sum(
        question.grade
        for question in questions
        if any(
            choice.id in submitted_choice_ids and choice.id in correct_choice_ids
            for choice in question.choices.all()
        )
    )

    percentage = (
        round((score / total_grade) * 100, 2)
        if total_grade > 0
        else 0
    )

    context = {
        "course": course,
        "submission": submission,
        "questions": questions,
        "score": score,
        "grade": score,
        "total_grade": total_grade,
        "percentage": percentage,
        "passed": percentage >= 70,
        "choices": submission.choices.all(),
    }

    return render(
        request,
        "onlinecourse/exam_result_bootstrap.html",
        context,
    )
