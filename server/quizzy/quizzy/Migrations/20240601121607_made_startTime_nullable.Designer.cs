﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using quizzy.Data;

#nullable disable

namespace quizzy.Migrations
{
    [DbContext(typeof(QuizzyDbContext))]
    [Migration("20240601121607_made_startTime_nullable")]
    partial class made_startTime_nullable
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("quizzy.Entities.Answer", b =>
                {
                    b.Property<Guid>("AnswerId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<bool>("IsCorrect")
                        .HasColumnType("boolean");

                    b.Property<Guid>("OptionId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("QuestionId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("QuizId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("ResultId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("AnswerId");

                    b.HasIndex("OptionId");

                    b.HasIndex("QuestionId");

                    b.HasIndex("QuizId");

                    b.HasIndex("ResultId");

                    b.HasIndex("UserId");

                    b.ToTable("Answers");
                });

            modelBuilder.Entity("quizzy.Entities.AppUser", b =>
                {
                    b.Property<Guid>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PasswordSalt")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("RoleID")
                        .HasColumnType("uuid");

                    b.HasKey("UserId");

                    b.HasIndex("RoleID");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("quizzy.Entities.Option", b =>
                {
                    b.Property<Guid>("OptionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<bool>("IsCorrect")
                        .HasColumnType("boolean");

                    b.Property<int>("OptionNo")
                        .HasColumnType("integer");

                    b.Property<Guid>("QuestionId")
                        .HasColumnType("uuid");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("OptionId");

                    b.HasIndex("QuestionId");

                    b.ToTable("Options");
                });

            modelBuilder.Entity("quizzy.Entities.Question", b =>
                {
                    b.Property<Guid>("QuestionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int>("Marks")
                        .HasColumnType("integer");

                    b.Property<int>("QuestionNo")
                        .HasColumnType("integer");

                    b.Property<Guid>("QuizId")
                        .HasColumnType("uuid");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("QuestionId");

                    b.HasIndex("QuizId");

                    b.ToTable("Questions");
                });

            modelBuilder.Entity("quizzy.Entities.Quiz", b =>
                {
                    b.Property<Guid>("QuizId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<bool>("Active")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(true);

                    b.Property<Guid>("CreatedBy")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreationTime")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasDefaultValueSql("NOW()");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("TotalTimeInSeconds")
                        .HasColumnType("integer");

                    b.HasKey("QuizId");

                    b.HasIndex("CreatedBy");

                    b.ToTable("Quizzes");
                });

            modelBuilder.Entity("quizzy.Entities.Result", b =>
                {
                    b.Property<Guid>("ResultId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime?>("EndTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int?>("NoOfAttemptedQuestions")
                        .HasColumnType("integer");

                    b.Property<int?>("NoOfCorrectAnswers")
                        .HasColumnType("integer");

                    b.Property<int?>("NoOfWrongAnswers")
                        .HasColumnType("integer");

                    b.Property<int?>("ObtainedMarks")
                        .HasColumnType("integer");

                    b.Property<Guid>("QuizId")
                        .HasColumnType("uuid");

                    b.Property<DateTime?>("StartTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<double?>("TimeTakenInSecs")
                        .HasColumnType("double precision");

                    b.Property<int>("TotalMarks")
                        .HasColumnType("integer");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("ResultId");

                    b.HasIndex("QuizId");

                    b.HasIndex("UserId");

                    b.ToTable("Results");
                });

            modelBuilder.Entity("quizzy.Entities.Role", b =>
                {
                    b.Property<Guid>("RoleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<string>("RoleName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("RoleId");

                    b.ToTable("Roles");
                });

            modelBuilder.Entity("quizzy.Entities.Answer", b =>
                {
                    b.HasOne("quizzy.Entities.Option", "Option")
                        .WithMany()
                        .HasForeignKey("OptionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("quizzy.Entities.Question", "Question")
                        .WithMany()
                        .HasForeignKey("QuestionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("quizzy.Entities.Quiz", "Quiz")
                        .WithMany()
                        .HasForeignKey("QuizId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("quizzy.Entities.Result", "Result")
                        .WithMany("Answers")
                        .HasForeignKey("ResultId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("quizzy.Entities.AppUser", "AppUser")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("AppUser");

                    b.Navigation("Option");

                    b.Navigation("Question");

                    b.Navigation("Quiz");

                    b.Navigation("Result");
                });

            modelBuilder.Entity("quizzy.Entities.AppUser", b =>
                {
                    b.HasOne("quizzy.Entities.Role", "Role")
                        .WithMany()
                        .HasForeignKey("RoleID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Role");
                });

            modelBuilder.Entity("quizzy.Entities.Option", b =>
                {
                    b.HasOne("quizzy.Entities.Question", "Question")
                        .WithMany("Options")
                        .HasForeignKey("QuestionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Question");
                });

            modelBuilder.Entity("quizzy.Entities.Question", b =>
                {
                    b.HasOne("quizzy.Entities.Quiz", "Quiz")
                        .WithMany("Questions")
                        .HasForeignKey("QuizId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Quiz");
                });

            modelBuilder.Entity("quizzy.Entities.Quiz", b =>
                {
                    b.HasOne("quizzy.Entities.AppUser", "AppUser")
                        .WithMany()
                        .HasForeignKey("CreatedBy")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("AppUser");
                });

            modelBuilder.Entity("quizzy.Entities.Result", b =>
                {
                    b.HasOne("quizzy.Entities.Quiz", "Quiz")
                        .WithMany()
                        .HasForeignKey("QuizId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("quizzy.Entities.AppUser", "AppUser")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("AppUser");

                    b.Navigation("Quiz");
                });

            modelBuilder.Entity("quizzy.Entities.Question", b =>
                {
                    b.Navigation("Options");
                });

            modelBuilder.Entity("quizzy.Entities.Quiz", b =>
                {
                    b.Navigation("Questions");
                });

            modelBuilder.Entity("quizzy.Entities.Result", b =>
                {
                    b.Navigation("Answers");
                });
#pragma warning restore 612, 618
        }
    }
}
