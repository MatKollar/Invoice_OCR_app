import re
import requests


def get_invoice_number(lines):
    invoice_number = ''
    after_word = False
    for line in lines:
        if 'faktúra' in line.lower() or 'číslo' in line.lower():
            words = line.split()
            for word in words:
                if word.lower() == 'faktúra' or word.lower() == 'číslo':
                    after_word = True
                if word.isdigit() and after_word:
                    invoice_number = word
                    return invoice_number
    return invoice_number


def get_variable_symbol(lines):
    var_symbol = ''
    for line in lines:
        if 'variabilný' in line.lower():
            words = line.split()
            for word in words:
                if word.isdigit():
                    var_symbol = word
                    return var_symbol
    return var_symbol


def get_date_of_issue(lines):
    date_of_issue = ''
    date_pattern = re.compile(r"\d{1,2}\.\d{1,2}\.\d{4}")
    for line in lines:
        if 'd%tum' in line.lower():
            if line.find('vystaven'):
                words = line.split()
                for word in words:
                    if date_pattern.match(word):
                        date_of_issue = word
                        return date_of_issue
        if (('dátum' in line.lower() and 'vystavenia' in line.lower() or 'vyhotovenia' in line.lower()) or 'vyhotovená:' in line.lower() or 'vystavenia:' in line.lower()):
            words = line.split()
            for word in words:
                if date_pattern.match(word):
                    date_of_issue = word
                    return date_of_issue
    return date_of_issue


def get_due_date(lines):
    due_date = ''
    date_pattern = re.compile(r"\d{1,2}\.\d{1,2}\.\d{4}")
    for line in lines:
        if (('dátum' in line.lower() and 'splatnosti' in line.lower()) or 'splatnosť:' in line.lower() or 'splatnosti:' in line.lower()):
            words = line.split()
            for word in words:
                if date_pattern.match(word):
                    due_date = word
                    return due_date
    return due_date


def get_delivery_date(lines):
    delivery_date = ''
    date_pattern = re.compile(r"\d{1,2}\.\d{1,2}\.\d{4}")
    for line in lines:
        if 'dátum' in line.lower() and ('dodania' in line.lower() or 'uskut.' in line.lower()
                                        or 'plnenia' in line.lower()) or 'dodanie' in line.lower() or 'dodania' in line.lower():
            words = line.split()
            for word in words:
                if date_pattern.match(word):
                    delivery_date = word
                    return delivery_date
    return delivery_date


def get_payment_method(lines):
    payment_method = ''
    for line in lines:
        if (('forma' in line.lower() or 'spôsob' in line.lower()) and ('úhrady'.rstrip('.') in line.lower() or 'platby'.rstrip(':') in line.lower())) or 'úhrada'.rstrip(':') in line.lower():
            words = line.split()
            for i, word in enumerate(words):
                if word.lower().rstrip('.:') == 'úhrady' or word.lower().rstrip('.:') == 'úhrada' or word.lower().rstrip('.:') == 'platby':
                    if any(x in words for x in ['prevod', 'Prevod', 'prevodom', 'Prevodom']):
                        payment_method = 'Bankovým prevodom'
                    elif any(x in words for x in ['hotovosť', 'Hotovosť', 'hotovosťou', 'Hotovosťou', 'hotovosti']):
                        payment_method = 'Hotovosťou'
                    else:
                        if i+1 < len(words) and words[i + 1].isalpha():
                            payment_method = words[i + 1]
                        elif i+2 < len(words):
                            payment_method = words[i + 2]
                    return payment_method
    return payment_method


def get_total_price(lines):
    total_price = ''
    pattern = re.compile(r"\b\d+(?:[,\s]\d+)*\b")
    for line in lines:
        if ((('celkom' in line.lower() or 'spolu' in line.lower()) and ('€' in line or 'eur' in line.lower())) or
                (('celková' in line.lower() or 'fakturovaná' in line.lower()) and ('suma' in line.lower() or 'hodnota' in line.lower()))):
            line = re.sub(r'(\d)\s+(\d)', r'\1\2', line)
            words = line.split()
            for word in words:
                if pattern.match(word):
                    total_price = word
                    return total_price
    return total_price


def get_bank(lines):
    bank = ''
    for line in lines:
        if 'čsob' in line.lower():
            bank = 'ČSOB'
            return bank
        if 'tatrabanka' in line.lower() or 'tatra' in line.lower():
            bank = 'Tatrabanka'
            return bank
        if 'banka' in line.lower():
            words = line.split()
            last_word_index = len(words) - 1
            for i, word in enumerate(words):
                if word.lower() == 'banka:' and i != last_word_index:
                    bank = words[i + 1]
                    return bank
    return bank


def get_swift(lines):
    swift = ''
    pattern = re.compile(r'^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$')
    for line in lines:
        if 'swift' in line.lower() or 'swft' in line.lower():
            words = line.split()
            for word in words:
                if len(word) >= 8:
                    if pattern.match(word):
                        swift = word
                        return swift
            for i, word in enumerate(words):
                last_word_index = len(words) - 1
                if word.lower() == 'swift:' and i != last_word_index:
                    swift = words[i + 1]
                    return swift
    return swift


def get_iban(lines):
    iban = ''
    pattern = re.compile(
        r'[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}')
    for line in lines:
        if 'iban' in line.lower() or 'účet'.rstrip(':') in line.lower():
            line = re.sub(r'(\d)\s+(\d)', r'\1\2', line)
            words = line.split()
            for word in words:
                if len(word) >= 15:
                    if pattern.match(word):
                        iban = word
                        return iban
            for i, word in enumerate(words):
                last_word_index = len(words) - 1
                if word.lower() == 'iban:' and i != last_word_index:
                    iban = words[i + 1]
                    return iban
    return iban


def get_supplier_ico(lines):
    ico = ''
    pattern = re.compile(r"\b\d{8}\b")
    for i, line in enumerate(lines):
        if ('ičo' in line.lower() or '1čo'.rstrip(':') in line.lower() or '1ičo' in line.lower() or
                '1č0' in line.lower()) and 'odberateľ' not in line.lower():
            words = line.split()
            for j, word in enumerate(words):
                if pattern.match(word):
                    ico = word.rstrip(',')
                    del word
                    del words[j]
                    lines[i] = ' '.join(words)
                    return ico
    return ico


def get_buyer_ico(lines):
    ico = ''
    pattern = re.compile(r"\b\d{8}\b")
    for i, line in enumerate(lines):
        if 'ičo' in line.lower() or '1čo'.rstrip(':') in line.lower() or '1ičo' in line.lower() or '1č0' in line.lower():
            words = line.split()
            for j, word in enumerate(words):
                if pattern.match(word):
                    ico = word
                    del word
                    del words[j]
                    lines[i] = ' '.join(words)
                    return ico
    return ico


def parse_text(text):
    lines = text.split('\n')
    supplier_data = {}
    buyer_data = {}

    supplier_ico = get_supplier_ico(lines)
    if supplier_ico:
        details_url = f"http://localhost:5000/get_details?ico={supplier_ico}"
        supplier_details = requests.post(details_url)

        if supplier_details.status_code == 200:
            supplier_data = supplier_details.json()['data']

    buyer_ico = get_buyer_ico(lines)
    if buyer_ico:
        details_url = f"http://localhost:5000/get_details?ico={buyer_ico}"
        buyer_details = requests.post(details_url)

        if buyer_details.status_code == 200:
            buyer_data = buyer_details.json()['data']

    data = {
        'invoice_number': get_invoice_number(lines),
        'var_symbol': get_variable_symbol(lines),
        'date_of_issue': get_date_of_issue(lines),
        'due_date': get_due_date(lines),
        'delivery_date': get_delivery_date(lines),
        'payment_method': get_payment_method(lines),
        'total_price': get_total_price(lines),
        'bank': get_bank(lines),
        'swift': get_swift(lines),
        'iban': get_iban(lines),
        'buyer_ico': buyer_ico,
        'supplier_ico': supplier_ico,
        'supplier_data': supplier_data,
        'buyer_data': buyer_data
    }
    return data
