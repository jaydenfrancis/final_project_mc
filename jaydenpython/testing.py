# quick little choose your own adventure game to practice functions in Python
from sys import exit

def red():
    print("good choice! you lived")

def blue():
    print("tough one, you died!")


def start():
    print("welcome to the Room, it is pitch black")
    print("you feel around and find a flash-light")
    print("turning it on reveals two doors, one red and one blue")
    print("type 'red' to enter the red door")
    print("type 'blue' to enter the blue door")

    input1 = input("> ")

    if input1 == "red":
        red()

    elif input1 == "blue":
        blue()
    else:
        print("you didn't make a choice and you died")


start()

